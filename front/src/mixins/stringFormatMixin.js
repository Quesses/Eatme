export default {
  methods: {
    toLowerCaseAndTrim (str) {
      if (!str) return ''
      str = str.toString()
      return str.trim().toLowerCase()
    },
    capitalizeFirstLetter (str) {
      if (!str) return ''
      str = str.toString()
      str = str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
      return str
    }
  },
  filters: {
    toLowerCaseAndTrim (str) {
      if (!str) return ''
      str = str.toString()
      return str.trim().toLowerCase()
    },
    capitalizeFirstLetter (str) {
      if (!str) return ''
      str = str.toString()
      str = str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
      return str
    },
    listRender (list, maxLength = 30) {
      var str = ''
      for (var listIndex in list) {
        if (!list[listIndex]) break
        var text = list[listIndex].toString().trim()
        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
        str += text
        if (str.length > maxLength) {
          str += '...'
          return str
        }
        if (parseInt(listIndex) + 1 !== list.length) {
          str += ', '
        }
      }
      return str
    }
  }
}
