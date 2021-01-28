const BOT_PREFIX: string = "wl!";

interface StringMap  { [key:string]: number };
const COLOR: StringMap =  {
    "pink": 0xFFC0CB,
    "red": 0xFF0000,
    "blue": 0x0000FF,
    "light blue": 0x99CFE0,
    "hot blue": 0x0066FF,
};

export { BOT_PREFIX, COLOR };