import {writeFile, writeFileSync} from 'fs';
import fetch from 'node-fetch';

let roles = {};

function sanitize(name) {
    return name.toLowerCase().replace(/(\s|'|_|-)/g, "");
}

Promise.all(
    [fetch("https://clocktower.patters.live/roles").then(data => data.json()).then(data => {
        for (let item of data.data) {
            roles[sanitize(item.id)] = roles[sanitize(item.id)] || {};
            Object.assign(roles[sanitize(item.id)], {
                name: item.name,
                type: item.type,
                ability: item.ability,
            });
        }
    }),
    fetch("https://script.bloodontheclocktower.com/data/roles.json").then(data => data.json()).then(data => {
        for (let item of data) {
            roles[sanitize(item.id)] = roles[sanitize(item.id)] || {};
            roles[sanitize(item.id)].icon = "https://script.bloodontheclocktower.com/" + item.icon.slice(2);
        }
    })]).then(() => {
        return new Promise((res) => writeFile("roles.json", JSON.stringify(roles), {}, res));
    })