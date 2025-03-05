import locations from '../enums/locations.jsx'

const listDs = () => {
    const listDs = []
    for (const ds of Object.keys(locations)) {
        if (ds === 'riung') {
            listDs.push('RIUNG BANDUNG')
        } else {
            listDs.push(ds.toUpperCase())
        }
    }
    return listDs
}

const listKlp = (ds) => {
    if (ds === 'MOVING') return []
    if (ds === 'RIUNG BANDUNG') return locations['riung']
    return locations[ds.toLowerCase()]
}

export {
    listDs,
    listKlp
}