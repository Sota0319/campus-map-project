function initializeCampusOverview() {
  const campusMap = document.querySelector('map[name="campus-map"]');
  if (campusMap) {
      campusMap.querySelectorAll('area').forEach(area => {
          area.addEventListener('click', (e) => {
              e.preventDefault();
              const buildingId = area.getAttribute('data-building');
              showBuildingDetails(buildingId);
          });
      });
  }

  document.querySelectorAll('#facility-filters input, #floor-filters input').forEach(input => {
      input.addEventListener('change', filterFacilities);
  });

  filterFacilities();
}

function showBuildingDetails(buildingId) {
  const building = campusData[buildingId];
  if (!building) return; 

  const buildingOverview = document.getElementById('building-overview');
  const floorDetails = document.getElementById('floor-details');
 
  document.getElementById('building-name').textContent = building.name;
  document.getElementById('building-image').src = building.image;

  let floorOptions = '<select id="floor-select">';
  for (const floor in building.floors) {
      floorOptions += `<option value="${floor}">${floor}</option>`;
  }
  floorOptions += '</select>';

  buildingOverview.innerHTML += floorOptions;

  document.getElementById('floor-select').addEventListener('change', (e) => {
      showFloorDetails(buildingId, e.target.value);
  });

  showFloorDetails(buildingId, Object.keys(building.floors)[0]);
}

function showFloorDetails(buildingId, floorId) {
  const building = campusData[buildingId];
  const floor = building.floors[floorId];
  const floorDetails = document.getElementById('floor-details');
  if (!floorDetails || !floor) return; 

  document.getElementById('floor-name').textContent = floorId;

  const floorMapElement = document.getElementById('floor-map');
  if (floor.map) {
      floorMapElement.style.display = 'block';
      if (Array.isArray(floor.map)) {
          floorMapElement.src = floor.map[0]; 
      } else {
          floorMapElement.src = floor.map;
      }
  } else {
      floorMapElement.style.display = 'none';
  }

  let facilitiesHtml = '';
  for (const [facilityType, facilities] of Object.entries(floor.facilities)) {
      facilitiesHtml += `<h4>${facilityType}</h4>`;
      facilities.forEach(facility => {
          facilitiesHtml += `
              <div class="facility" data-type="${facilityType}">
                  <p>${facility.count}箇所</p>
                  <img src="${facility.image}" alt="${facilityType}" class="facility-image">
              </div>
          `;
      });
  }

  document.getElementById('facilities').innerHTML = facilitiesHtml;

  document.querySelectorAll('.facility-image').forEach(img => {
      img.addEventListener('click', () => {
          showEnlargedImage(img.src);
      });
  });

  filterFacilities();
}

function filterFacilities() {
  const selectedFacilities = Array.from(document.querySelectorAll('#facility-filters input:checked')).map(cb => cb.value);
  const selectedFloors = Array.from(document.querySelectorAll('#floor-filters input:checked')).map(cb => cb.value);

  document.querySelectorAll('.floor').forEach(floor => {
      const floorId = floor.getAttribute('id').split('-')[1];

      if (selectedFloors.includes(floorId)) {
          floor.style.display = 'block';

          floor.querySelectorAll('.facility').forEach(facility => {
              const facilityType = facility.getAttribute('data-type');
              if (selectedFacilities.includes(facilityType)) {
                  facility.style.display = 'block';
              } else {
                  facility.style.display = 'none';
              }
          });
      } else {

          floor.style.display = 'none';
      }
  });
}

document.addEventListener('DOMContentLoaded', initializeCampusOverview);
