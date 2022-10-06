const days = (word) => {
    const days = {
        Monday    : 'Senin',
        Tuesday   : 'Selasa',
        Wednesday : 'Rabu',
        Thursday  : 'Kamis',
        Friday    : 'Jumat',
        Saturday  : 'Sabtu',
        Sunday    : 'Minggu',
    }

    return days[word]
}

const translate = {
    days,
}
  
export default translate