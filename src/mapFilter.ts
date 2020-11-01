/*
 * Script Name: Map Filter
 * Version: v0.0.1
 * Last Updated: 2020-09-03
 * Author: Pegak
 */

const scriptData = {
  name: "Map Filter",
  version: "v0.0.1",
  author: "Pegak",
};

const chainFilter = (...fns: PipeableFilter[]) => (v: Village) =>
  fns.map((fn) => fn(v));

type PipeableFilter = (a: Village) => boolean;
type Village = {
  id: string;
  owner: string;
  points: string;
};

// Configurable filters
const isBarb = (v: Village) => +v.owner != 0;
const pointsAbove = (points: number) => (v: Village) => +v.points >= points;
const pointsUnder = (points: number) => (v: Village) => +v.points <= points;

// Show filter UI
function initFilter() {
  const content = `
  <div class="info_box">
    <form id="filter">
      <div>
        <input type="checkbox" id="barbsC" name="barbsC">
        <label for="barbsC">Pouze vesnice barbarů</label>
      </div>

      <div>
      <input type="checkbox" id="pointsUC" name="pointsUC">
      <label for="pointsUC">Více než:</label>
      <input type="number" id="pointsUF" name="pointsUF">
      </div>

      <div>
        <input type="checkbox" id="pointsAC" name="pointsAC">
        <label for="pointsAC">Méně než:</label>
        <input type="number" id="pointsAF" name="pointsAF">
      </div>

      <br>
      <input class="btn" type="submit" id="doFilter" value="Filtrovat">
    </form>
  </div>
  <style>
    #filter {
      display: flex;
      justify-content: space-around;
    }
  </style>
  `;

  $("#contentContainer").before(content);

  document.getElementById("filter")?.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let filters: PipeableFilter[] = [];

    $("#barbsC").is(":checked") && filters.push(isBarb);
    $("#pointsUC").is(":checked") &&
      !!$("#pointsUF").val() &&
      filters.push(pointsUnder(+$("#pointsUF").val()!));
    $("#pointsAC").is(":checked") &&
      !!$("#pointsAF").val() &&
      filters.push(pointsAbove(+$("#pointsAF").val()!));

    filter(filters);
  });
}

// Filter villages based on selected filters
function filter(filters: PipeableFilter[]) {
  const villages = Object.values(
    window.TWMap.villages as Village[]
  ).filter((v) => chainFilter(...filters)(v).some((c) => !!c));

  villages.forEach(removeVillage);
}

// Helper: Remove village from map
function removeVillage(village: Village) {
  $("#map_container > div:first-child").css({
    display: "none",
  });
  $(`[id="map_village_${village.id}"]`).css({
    display: "none",
  });
  $(`[id="map_icons_${village.id}"]`).css({
    display: "none",
  });
  $("#map_village_undefined").css({
    display: "none",
  });
  $('img[src="/graphic/map/reserved_player.png"]').css({
    display: "none",
  });
  $('img[src="/graphic/map/reserved_team.png"]').css({
    display: "none",
  });
  $("#map canvas").css({
    display: "none",
  });
}

// Helper: Get parameter by name
function getParameterByName(name: string, url = window.location.href) {
  return new URL(url).searchParams.get(name);
}

// Initalize Script
(function () {
  const gameScreen = getParameterByName("screen");

  if (gameScreen === "map") {
    initFilter();
  } else {
    window.UI.ErrorMessage("Skript musí být spuštěn na mapě!", 4000);
  }
})();
