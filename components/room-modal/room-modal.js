// components/room-modal/room-modal.js

let roomsData = null;

async function fetchRoomsData() {
  if (roomsData) return roomsData;
  try {
    // Add a cache buster parameter to avoid browser caching the JSON file
    const cacheBuster = new Date().getTime();
    const response = await fetch(`/content/rooms.json?v=${cacheBuster}`);
    roomsData = await response.json();
    return roomsData;
  } catch (error) {
    console.error('Error fetching rooms data:', error);
    return [];
  }
}

export async function initRoomModal() {
  const modal = document.getElementById('room-detail-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.room-modal__close');
  const overlay = modal.querySelector('.room-modal__overlay');
  const roomCards = document.querySelectorAll('.room-card[data-room-id]');

  // Pre-fetch data
  await fetchRoomsData();

  function openModal(roomId) {
    const room = roomsData.find(r => r.id === roomId);
    if (!room) return;

    // Populate Data
    // Note: Assuming a basic i18n approach, we default to DE.
    document.getElementById('rm-title').textContent = room.name;
    document.getElementById('rm-subtitle').textContent = room.subtitle;
    document.getElementById('rm-capacity').textContent = room.capacity;
    document.getElementById('rm-price').textContent = room.price;
    document.getElementById('rm-usage').textContent = room.usage;
    document.getElementById('rm-booking').textContent = room.bookingNotes;
    
    // Image Slider handling
    const imgWrapper = document.getElementById('rm-image-wrapper');
    const sliderContainer = document.getElementById('rm-image-slider');
    const prevBtn = document.getElementById('rm-slider-prev');
    const nextBtn = document.getElementById('rm-slider-next');
    const indicatorsContainer = document.getElementById('rm-slider-indicators');
    
    // Clear existing slider content
    if(sliderContainer) sliderContainer.innerHTML = '';
    if(indicatorsContainer) indicatorsContainer.innerHTML = '';
    
    const imagesToUse = room.images && room.images.length > 0 ? room.images : (room.image ? [room.image] : []);
    
    if (imagesToUse.length > 0 && sliderContainer) {
      imagesToUse.forEach((imgSrc, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'w-full h-full flex-shrink-0 snap-start';
        slide.style.cssText = 'min-width: 100%; flex-shrink: 0;';
        slide.innerHTML = `<img src="${imgSrc}" alt="${room.name} Experience ${index + 1}" class="w-full h-full object-cover mix-blend-luminosity opacity-50 hover:opacity-100 hover:mix-blend-normal transition-all duration-700">`;
        sliderContainer.appendChild(slide);
        
        // Create indicator if more than 1 image
        if (imagesToUse.length > 1 && indicatorsContainer) {
          const indicator = document.createElement('button');
          indicator.className = `w-2 h-2 rounded-full transition-all ${index === 0 ? 'bg-brand-yellow w-4' : 'bg-white/50 hover:bg-white/80'}`;
          indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
          indicator.addEventListener('click', () => {
            sliderContainer.scrollTo({
              left: index * sliderContainer.clientWidth,
              behavior: 'smooth'
            });
          });
          indicatorsContainer.appendChild(indicator);
        }
      });
      
      imgWrapper.classList.remove('hidden');
      
      if (imagesToUse.length > 1) {
        if(prevBtn) prevBtn.classList.remove('hidden');
        if(nextBtn) nextBtn.classList.remove('hidden');
        
        // Handle scroll logic for indicators
        sliderContainer.onscroll = () => {
          const index = Math.round(sliderContainer.scrollLeft / sliderContainer.clientWidth);
          if(indicatorsContainer) {
            Array.from(indicatorsContainer.children).forEach((ind, i) => {
              if (i === index) {
                ind.className = 'w-4 h-2 rounded-full bg-brand-yellow transition-all';
              } else {
                ind.className = 'w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-all';
              }
            });
          }
        };
        
        // Next/Prev buttons
        if(prevBtn) {
          prevBtn.onclick = () => {
            sliderContainer.scrollBy({ left: -sliderContainer.clientWidth, behavior: 'smooth' });
          };
        }
        if(nextBtn) {
          nextBtn.onclick = () => {
            sliderContainer.scrollBy({ left: sliderContainer.clientWidth, behavior: 'smooth' });
          };
        }
      } else {
        if(prevBtn) prevBtn.classList.add('hidden');
        if(nextBtn) nextBtn.classList.add('hidden');
        sliderContainer.onscroll = null;
      }
    } else if (imgWrapper) {
      imgWrapper.classList.add('hidden');
    }

    const floorplanWrapper = document.getElementById('rm-floorplan-wrapper');
    const floorplanEl = document.getElementById('rm-floorplan');
    if (room.floorplan) {
      floorplanEl.src = room.floorplan;
      floorplanWrapper.classList.remove('hidden');
    } else {
      floorplanWrapper.classList.add('hidden');
    }

    // Equipment list
    const eqList = document.getElementById('rm-equipment');
    eqList.innerHTML = '';
    if (room.equipment && room.equipment.length > 0) {
      room.equipment.forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-3';
        li.innerHTML = `<span class="w-1 h-1 bg-brand-yellow rounded-full"></span> <span>${item}</span>`;
        eqList.appendChild(li);
      });
    }

    // Reset closing state if any
    modal.classList.remove('is-closing');
    
    // Lock body scroll
    document.body.classList.add('modal-open');
    
    // Show modal
    modal.showModal();
  }

  function closeModal() {
    // Add closing class to trigger CSS exit animations
    modal.classList.add('is-closing');
    
    // Unlock body scroll
    document.body.classList.remove('modal-open');

    // Wait for animation to finish before actually closing
    setTimeout(() => {
      modal.close();
      modal.classList.remove('is-closing');
    }, 400); // Matches the 0.4s CSS animation
  }

  // Attach event listeners to cards
  roomCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const roomId = card.getAttribute('data-room-id');
      if (roomId) {
        openModal(roomId);
      }
    });
  });

  // Close handlers
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Handle native ESC key close (intercept to add animation)
  modal.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeModal();
  });
}
