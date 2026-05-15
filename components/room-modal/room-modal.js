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
    
    // Image & Floorplan handling
    const imgWrapper = document.getElementById('rm-image-wrapper');
    const imgEl = document.getElementById('rm-image');
    if (room.image) {
      imgEl.src = room.image;
      imgWrapper.classList.remove('hidden');
    } else {
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
