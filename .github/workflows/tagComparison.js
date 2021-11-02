
const tagVersionSplit = (tagVersionArray) => {
    const tagVersionMissingNumArray = tagVersionArray.length == 3 ? [] : Array(3 - tagVersionArray.length).fill("0")
    return tagVersionArray.concat(tagVersionMissingNumArray)
}

const newTagGreaterThanLatest = (newTagArray, latestTagArray) => {
    for (let i = 0; i < 3; i++) {
        if (newTagArray[i] > latestTagArray[i]) {
            return "true"
        } else if (latestTagArray[i] > newTagArray[i]) {
            return "false"
        }
    }
}

const compareTagVersions = (latestTag, newTag) => {

    if (!latestTag) {
        return "true"
    }

    const latestTagVersion = latestTag.split('docker/v')
    const newTagVersion = newTag.split('v')

    if (latestTagVersion == newTagVersion) {
        return "false"
    }

    const latestTagVersionArray = latestTagVersion[1].split('.')
    const newTagVersionArray = newTagVersion[1].split('.')

    const updatedLatestTagVersionArray = tagVersionSplit(latestTagVersionArray)
    const updatedNewTagVersionArray = tagVersionSplit(newTagVersionArray)

    return newTagGreaterThanLatest(updatedNewTagVersionArray, updatedLatestTagVersionArray)
}

module.exports = () => {
    const { LATEST_TAG_VERSION , NEW_TAG_VERSION } = process.env
    return compareTagVersions(LATEST_TAG_VERSION, NEW_TAG_VERSION)
}