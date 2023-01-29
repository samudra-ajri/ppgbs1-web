const ppg = (word) => {
    return word
        .replace('Ppk', 'PPK')
        .replace('Ppd', 'PPD')
        .replace('Ppg', 'PPG')
}

const classType = (word) => {
    return word
        .replace('CR', 'Cabe Rawit')
        .replace('PR', 'Pra Remaja')
        .replace('RM', 'Remaja')
        .replace('PN', 'Pra Nikah')
}

const stringCast = {
    ppg,
    classType
}

export default stringCast