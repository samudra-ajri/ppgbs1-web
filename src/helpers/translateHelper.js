const words = {
    extra: 'penunjang',
    rote: 'hafalan'
}

function translate(word) {
    return words[word] ? words[word] : word
}

export default translate