// src/data/collections.js
// Rang nomlari i18n key sifatida saqlanadi
import lisbonImg from "../assets/lizbon-13.jpg";
import liz from "../assets/photo_2026-06-08_23-02-46.jpg"

export const colorKeys = {
  white:  "colors.white",
  gray:   "colors.gray",
  beige:  "colors.beige",
  black:  "colors.black",
  blue:   "colors.blue",
  green:  "colors.green",
  brown:  "colors.brown",
  cream:  "colors.cream",
  pink:   "colors.pink",
  red:    "colors.red",
};

export const collections = {

  "Plisse jaluziyalar": {
    type: "collections",
    items: [
      {
        id: "plisse-lizbon",
        name: "Lizbon",
        price: "$15",
        image: lisbonImg,
        colors: [
          { name: "Oq",        nameKey: "colors.white",  image: liz },
          { name: "Kulrang",   nameKey: "colors.gray",   image: null },
          { name: "Bej",       nameKey: "colors.beige",  image: null },
          { name: "Jigarrang", nameKey: "colors.brown",  image: null },
        ],
      },
      {
        id: "plisse-river",
        name: "River",
        price: "$20",
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Ko'k",    nameKey: "colors.blue",  image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
        ],
      },
      {
        id: "plisse-perla",
        name: "Perla",
        price: "$20",
        image: null,
        colors: [
          { name: "Oq",     nameKey: "colors.white", image: null },
          { name: "Krem",   nameKey: "colors.cream", image: null },
          { name: "Pushti", nameKey: "colors.pink",  image: null },
        ],
      },
      {
        id: "plisse-karmen",
        name: "Karmen",
        price: "$20",
        image: null,
        colors: [
          { name: "Qizil",     nameKey: "colors.red",   image: null },
          { name: "Qora",      nameKey: "colors.black", image: null },
          { name: "Jigarrang", nameKey: "colors.brown", image: null },
        ],
      },
      {
        id: "plisse-blackout",
        name: "Blackout",
        price: "$25",
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Qora",    nameKey: "colors.black", image: null },
          { name: "Bej",     nameKey: "colors.beige", image: null },
        ],
      },
    ],
  },

  "Kun va Tun jaluziyalari": {
    type: "collections",
    items: [
      {
        id: "kuntun-0",
        name: "0-koleksiya",
        price: "€50",
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Bej",     nameKey: "colors.beige", image: null },
        ],
      },
      {
        id: "kuntun-1",
        name: "1-koleksiya",
        price: "€53",
        image: null,
        colors: [
          { name: "Oq",        nameKey: "colors.white", image: null },
          { name: "Jigarrang", nameKey: "colors.brown", image: null },
          { name: "Krem",      nameKey: "colors.cream", image: null },
        ],
      },
      {
        id: "kuntun-2",
        name: "2-koleksiya",
        price: "€55",
        image: null,
        colors: [
          { name: "Ko'k",    nameKey: "colors.blue",  image: null },
          { name: "Yashil",  nameKey: "colors.green", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
        ],
      },
      {
        id: "kuntun-3",
        name: "3-koleksiya",
        price: "€58",
        image: null,
        colors: [
          { name: "Qora",    nameKey: "colors.black", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Oq",      nameKey: "colors.white", image: null },
        ],
      },
      {
        id: "kuntun-4",
        name: "4-koleksiya",
        price: "€60",
        image: null,
        colors: [
          { name: "Oq",   nameKey: "colors.white", image: null },
          { name: "Krem", nameKey: "colors.cream", image: null },
          { name: "Bej",  nameKey: "colors.beige", image: null },
        ],
      },
    ],
  },

  "Vertikal jaluziyalar": {
    type: "colors_only",
    items: [
      { id: "vert-oq",      name: "Oq",        nameKey: "colors.white", image: null, price: "$38" },
      { id: "vert-kulrang", name: "Kulrang",   nameKey: "colors.gray",  image: null, price: "$38" },
      { id: "vert-bej",     name: "Bej",       nameKey: "colors.beige", image: null, price: "$38" },
      { id: "vert-jigar",   name: "Jigarrang", nameKey: "colors.brown", image: null, price: "$38" },
      { id: "vert-kok",     name: "Ko'k",      nameKey: "colors.blue",  image: null, price: "$38" },
      { id: "vert-yashil",  name: "Yashil",    nameKey: "colors.green", image: null, price: "$38" },
      { id: "vert-qora",    name: "Qora",      nameKey: "colors.black", image: null, price: "$38" },
      { id: "vert-pushti",  name: "Pushti",    nameKey: "colors.pink",  image: null, price: "$38" },
    ],
  },

  "Dikkey jaluziyalar": {
    type: "colors_only",
    items: [
      { id: "dik-oq",      name: "Oq",        nameKey: "colors.white", image: null, price: "$46" },
      { id: "dik-kulrang", name: "Kulrang",   nameKey: "colors.gray",  image: null, price: "$46" },
      { id: "dik-bej",     name: "Bej",       nameKey: "colors.beige", image: null, price: "$46" },
      { id: "dik-jigar",   name: "Jigarrang", nameKey: "colors.brown", image: null, price: "$48" },
      { id: "dik-kok",     name: "Ko'k",      nameKey: "colors.blue",  image: null, price: "$48" },
      { id: "dik-yashil",  name: "Yashil",    nameKey: "colors.green", image: null, price: "$48" },
      { id: "dik-qora",    name: "Qora",      nameKey: "colors.black", image: null, price: "$50" },
    ],
  },

  "Rollo jaluziyalari": {
    type: "collections",
    items: [
      {
        id: "rollo-eron",
        name: "Eron",
        price: "$35",
        badge: "Arzon",
        badgeColor: "green",
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Bej",     nameKey: "colors.beige", image: null },
          { name: "Qora",    nameKey: "colors.black", image: null },
        ],
      },
      {
        id: "rollo-xitoy",
        name: "Xitoy",
        price: "$51",
        badge: "Premium",
        badgeColor: "red",
        image: null,
        colors: [
          { name: "Oq",        nameKey: "colors.white", image: null },
          { name: "Kulrang",   nameKey: "colors.gray",  image: null },
          { name: "Bej",       nameKey: "colors.beige", image: null },
          { name: "Qora",      nameKey: "colors.black", image: null },
          { name: "Ko'k",      nameKey: "colors.blue",  image: null },
          { name: "Jigarrang", nameKey: "colors.brown", image: null },
        ],
      },
    ],
  },

  "Dabl Rollo jaluziyalar": {
    type: "collections",
    items: [
      {
        id: "dabl-yupqa",
        name: "Yupqa",
        price: "$32",
        badge: "Arzon",
        badgeColor: "green",
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Bej",     nameKey: "colors.beige", image: null },
        ],
      },
      {
        id: "dabl-qalin",
        name: "Qalin",
        price: "$39",
        badge: "Premium",
        badgeColor: "red",
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Bej",     nameKey: "colors.beige", image: null },
          { name: "Qora",    nameKey: "colors.black", image: null },
          { name: "Ko'k",    nameKey: "colors.blue",  image: null },
        ],
      },
    ],
  },

  "Masketniy setka": {
    type: "collections",
    items: [
      {
        id: "setka-olinadigan",
        name: "Olinadigan",
        price: "$18",
        badge: null,
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Qora",    nameKey: "colors.black", image: null },
        ],
      },
      {
        id: "setka-ochiladigan",
        name: "Ochiladigan",
        price: "$22",
        badge: null,
        image: null,
        colors: [
          { name: "Oq",      nameKey: "colors.white", image: null },
          { name: "Kulrang", nameKey: "colors.gray",  image: null },
          { name: "Qora",    nameKey: "colors.black", image: null },
        ],
      },
    ],
  },

  "Senaks": {
    type: "colors_only",
    items: [
      { id: "senaks-oq",      name: "Oq",        nameKey: "colors.white", image: null, price: "$24" },
      { id: "senaks-kulrang", name: "Kulrang",   nameKey: "colors.gray",  image: null, price: "$24" },
      { id: "senaks-bej",     name: "Bej",       nameKey: "colors.beige", image: null, price: "$24" },
      { id: "senaks-qora",    name: "Qora",      nameKey: "colors.black", image: null, price: "$26" },
      { id: "senaks-jigar",   name: "Jigarrang", nameKey: "colors.brown", image: null, price: "$26" },
    ],
  },

  "Suriladigan setka": {
    type: "colors_only",
    items: [
      { id: "suril-oq",      name: "Oq",        nameKey: "colors.white", image: null, price: "$22" },
      { id: "suril-kulrang", name: "Kulrang",   nameKey: "colors.gray",  image: null, price: "$22" },
      { id: "suril-bej",     name: "Bej",       nameKey: "colors.beige", image: null, price: "$22" },
      { id: "suril-qora",    name: "Qora",      nameKey: "colors.black", image: null, price: "$24" },
      { id: "suril-jigar",   name: "Jigarrang", nameKey: "colors.brown", image: null, price: "$24" },
    ],
  },
};