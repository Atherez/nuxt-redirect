module.exports = function (options) {
  return async function redirectRoute (req, res, next) {
    let decodedBaseUrl

    try {
      decodedBaseUrl = options.onDecode(req, res, next)
    } catch (error) {
      return options.onDecodeError(error, req, res, next)
    }

    const foundRule = options.rules.find(o => validateRoute(o, decodedBaseUrl))

    if (!foundRule) {
      return next()
    }

    let toTarget

    try {
      toTarget = typeof foundRule.to === 'function' ? await foundRule.to(foundRule.from, req) : foundRule.to
    } catch (error) {
      return next(error)
    }

    const toUrl = formURL(foundRule.from, toTarget, decodedBaseUrl)

    try {
      res.setHeader('Location', toUrl)
    } catch (error) {
      // Not passing the error as it's caused by URL that was user-provided so we
      // can't do anything about the error.
      return next()
    }

    res.statusCode = foundRule.statusCode || options.statusCode
    res.end()
  }
}

const validateRoute = (option, decodedBaseUrl)=>{
  option = option.from.split('/')
  decodedBaseUrl = decodedBaseUrl.split('/')
  if(option.length !== decodedBaseUrl.length)
    return false
  for(let i=0;i < decodedBaseUrl.length;i++){
    if(option[i].startsWith('_'))
      continue
    if(option[i]!==decodedBaseUrl[i])
      return false
  }
  return true
}

const formURL = (from, to, decodedBaseUrl)=>{
  from = from.split('/')
  decodedBaseUrl = decodedBaseUrl.split('/')
  for(let i=0; i < decodedBaseUrl.length; i++){
    if(from[i].startsWith('_')){
      to = to.replace(from[i], decodedBaseUrl[i])
    }
  }
  return to
}
