const romans = ["0","I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV" ]

const getRomanNumeral = (num) => {
    if(num < romans.length + 1) 
        return romans[num]
    else
        return num
}

export {getRomanNumeral}