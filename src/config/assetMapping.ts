export interface SpriteDefinition {
  sheet: string;
  sheetWidth: number;
  sheetHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number; // Optional scale adjustment
}

export const ASSET_SHEETS = {
  sheet1: "/assets/assets01.png",
  sheet2: "/assets/assets02.png",
};

const SHEET_SIZE = 1024; // Assumption

// TODO: Adjust these coordinates based on the actual image dimensions and layout.
// These are placeholder estimates assuming a roughly 3x3 grid layout on a 600x600 image.
export const ASSET_MAPPING: Record<string, SpriteDefinition> = {
  // Sheet 1 Items
  camera: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 10,
    y: 10,
    width: 180,
    height: 150,
  },
  chair: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 210,
    y: 10,
    width: 150,
    height: 200,
  },
  fridge: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 400,
    y: 10,
    width: 180,
    height: 300,
  },
  lamp: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 10,
    y: 200,
    width: 150,
    height: 200,
  }, // Lamp on table
  sofa: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 200,
    y: 250,
    width: 300,
    height: 180,
  },
  computer: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 520,
    y: 250,
    width: 150,
    height: 150,
  }, // Laptop

  // Avatars (Sheet 1)
  avatar_boy: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 150,
    y: 450,
    width: 150,
    height: 250,
  },
  avatar_girl: {
    sheet: ASSET_SHEETS.sheet1,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 350,
    y: 450,
    width: 150,
    height: 250,
  },

  // Sheet 2 Items
  wardrobe: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 10,
    y: 10,
    width: 180,
    height: 350,
  }, // Tall cabinet
  table: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 220,
    y: 50,
    width: 250,
    height: 120,
  }, // Long table
  mirror: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 500,
    y: 10,
    width: 150,
    height: 200,
  },
  ottoman: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 10,
    y: 400,
    width: 150,
    height: 120,
  },
  clock: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 200,
    y: 250,
    width: 120,
    height: 120,
  },
  plant: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 350,
    y: 200,
    width: 150,
    height: 250,
  },
  coffee_table: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 10,
    y: 550,
    width: 250,
    height: 120,
  },
  armchair: {
    sheet: ASSET_SHEETS.sheet2,
    sheetWidth: SHEET_SIZE,
    sheetHeight: SHEET_SIZE,
    x: 300,
    y: 500,
    width: 200,
    height: 200,
  },
};

// Fallback for items not in the sprites yet
export const getSprite = (id: string): SpriteDefinition | null => {
  return ASSET_MAPPING[id] || null;
};
