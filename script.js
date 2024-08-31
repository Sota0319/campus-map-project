// 初期化関数: チェックボックスのイベントリスナーを設定
function initializeCampusOverview() {
  // キャンパスマップのクリックイベントを設定
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

  // フィルタリング関数を呼び出すイベントリスナーを追加
  document.querySelectorAll('#facility-filters input, #floor-filters input').forEach(input => {
      input.addEventListener('change', filterFacilities);
  });

  // 初期フィルタリングの実行
  filterFacilities();
}

// 棟の詳細を表示する関数
function showBuildingDetails(buildingId) {
  const building = campusData[buildingId];
  if (!building) return; // building が存在しない場合は何もしない

  const buildingOverview = document.getElementById('building-overview');
  const floorDetails = document.getElementById('floor-details');
  
  // 棟全体の情報を表示
  document.getElementById('building-name').textContent = building.name;
  document.getElementById('building-image').src = building.image;

  // 階の選択肢を作成
  let floorOptions = '<select id="floor-select">';
  for (const floor in building.floors) {
      floorOptions += `<option value="${floor}">${floor}</option>`;
  }
  floorOptions += '</select>';

  buildingOverview.innerHTML += floorOptions;

  // 階選択時の動作
  document.getElementById('floor-select').addEventListener('change', (e) => {
      showFloorDetails(buildingId, e.target.value);
  });

  // 最初の階を表示
  showFloorDetails(buildingId, Object.keys(building.floors)[0]);
}

// 階の詳細を表示する関数
function showFloorDetails(buildingId, floorId) {
  const building = campusData[buildingId];
  const floor = building.floors[floorId];
  const floorDetails = document.getElementById('floor-details');
  if (!floorDetails || !floor) return; // 要素やデータが存在しない場合は何もしない

  document.getElementById('floor-name').textContent = floorId;

  // 階の地図の表示
  const floorMapElement = document.getElementById('floor-map');
  if (floor.map) {
      floorMapElement.style.display = 'block';
      if (Array.isArray(floor.map)) {
          floorMapElement.src = floor.map[0]; // 最初の地図を表示
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

  // 施設画像のクリックイベントを設定
  document.querySelectorAll('.facility-image').forEach(img => {
      img.addEventListener('click', () => {
          showEnlargedImage(img.src);
      });
  });

  // 施設のフィルタリング
  filterFacilities();
}

// チェックボックスの状態に基づいて施設をフィルタリングする関数
function filterFacilities() {
  const selectedFacilities = Array.from(document.querySelectorAll('#facility-filters input:checked')).map(cb => cb.value);
  const selectedFloors = Array.from(document.querySelectorAll('#floor-filters input:checked')).map(cb => cb.value);

  // すべての階要素をループ
  document.querySelectorAll('.floor').forEach(floor => {
      const floorId = floor.getAttribute('id').split('-')[1]; // 例: "1F", "2F" など

      // 階が選択されているかをチェック
      if (selectedFloors.includes(floorId)) {
          floor.style.display = 'block';

          // その階の施設をフィルタリング
          floor.querySelectorAll('.facility').forEach(facility => {
              const facilityType = facility.getAttribute('data-type');
              if (selectedFacilities.includes(facilityType)) {
                  facility.style.display = 'block';
              } else {
                  facility.style.display = 'none';
              }
          });
      } else {
          // 階自体を非表示
          floor.style.display = 'none';
      }
  });
}

// ページ読み込み時に初期化関数を呼び出す
document.addEventListener('DOMContentLoaded', initializeCampusOverview);
