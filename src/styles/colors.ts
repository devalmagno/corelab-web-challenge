const colors = {
    white: '#fff',
    lightBlue: '#BAE2FF',
    lightGreen: '#B9FFDD',
    lightYellow: '#FFE8AC',
    lightPink: '#FFCAB9',
    lightRed: '#F99494',
    blue: '#9DD6FF',
    pink: '#ECA1FF',
    yellow: '#DAFF8B',
    orange: '#FFA285',
    lightGray: '#CDCDCD',
    darkerGray: '#979797',
    brown: '#A99A7C',
}

const getPortugueseName = (name: string) => {
    // This is a simple example, you might want to use a more robust solution
    const translations: Record<string, string> = {
        white: 'Branco',
        lightBlue: 'Azul Claro',
        lightGreen: 'Verde Claro',
        lightYellow: 'Amarelo Claro',
        lightPink: 'Rosa Claro',
        lightRed: 'Vermelho Claro',
        blue: 'Azul',
        pink: 'Rosa',
        yellow: 'Amarelo',
        orange: 'Laranja',
        lightGray: 'Cinza Claro',
        darkerGray: 'Cinza Escuro',
        brown: 'Marrom',
    };

    return translations[name] || name; // Default to the original name if translation not found
}

// Creating a List based on the provided colors
const colorsList = Object.entries(colors).map(([name, hexCode]) => ({
    name,
    ptName: getPortugueseName(name), // You need to define the function getPortugueseName
    hexCode,
}));

export default colorsList;