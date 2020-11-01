"use strict";
const scriptData = {
    name: "Map Filter",
    version: "v0.0.1",
    author: "Pegak",
};
const chainFilter = (...fns) => (v) => fns.map((fn) => fn(v));
const isBarb = (v) => +v.owner != 0;
const pointsAbove = (points) => (v) => +v.points >= points;
const pointsUnder = (points) => (v) => +v.points <= points;
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
        let filters = [];
        $("#barbsC").is(":checked") && filters.push(isBarb);
        $("#pointsUC").is(":checked") &&
            !!$("#pointsUF").val() &&
            filters.push(pointsUnder(+$("#pointsUF").val()));
        $("#pointsAC").is(":checked") &&
            !!$("#pointsAF").val() &&
            filters.push(pointsAbove(+$("#pointsAF").val()));
        filter(filters);
    });
}
function filter(filters) {
    const villages = Object.values(window.TWMap.villages).filter((v) => chainFilter(...filters)(v).some((c) => !!c));
    villages.forEach(removeVillage);
}
function removeVillage(village) {
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
function getParameterByName(name, url = window.location.href) {
    return new URL(url).searchParams.get(name);
}
(function () {
    const gameScreen = getParameterByName("screen");
    if (gameScreen === "map") {
        initFilter();
    }
    else {
        window.UI.ErrorMessage("Skript musí být spuštěn na mapě!", 4000);
    }
})();
