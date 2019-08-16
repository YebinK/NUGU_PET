const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN } = require('../config')

class Directive {
  constructor({type, audioItem}) {
    this.type = type
    this.audioItem = audioItem
  }
}

function audioPlayerDirective(soundFileName) {

  return new Directive({
    type: 'AudioPlayer.Play',
    audioItem: {
      stream: {
        url: `${DOMAIN}/` + soundFileName,
        offsetInMilliseconds: 0,
        token: uuid(),
        expectedPreviousToken: 'expectedPreviousToken',
      }
    }
  })
}

class NPKRequest {
  constructor (httpReq) {
    this.context = httpReq.body.context
    this.action = httpReq.body.action
    console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`)
  }

  do(npkResponse) {
    this.actionRequest(npkResponse)
  }

  actionRequest(npkResponse) {
    console.log('actionRequest')
    console.dir(this.action)

    const actionName = this.action.actionName
    const parameters = this.action.parameters

    switch (actionName) {
    case 'answer.song':
      const soundTypeSlot = parameters.explain_song
      let soundFileName = 'empty.mp3'

      switch (soundTypeSlot.value) {
      case '힐링' || '힐링 음악':
        soundFileName = 'healing.mp3'
        break
      case '자장가' || '자장가 음악':
        soundFileName = 'lullaby.mp3'
        break
      case '분리불안' || '분리 불안':
        soundFileName = 'separation_anxiety.mp3'
        break
      }

      npkResponse.addDirective(audioPlayerDirective(soundFileName))
      break
    }
  }
}

class NPKResponse {
  constructor () {
    console.log('NPKResponse constructor')

    this.version = '2.0'
    this.resultCode = 'OK'
    this.output = {}
    this.directives = []
  }

  addDirective(directive) {
    this.directives.push(directive)
  }

}

const nuguReq = function (httpReq, httpRes, next) {
  npkResponse = new NPKResponse()
  npkRequest = new NPKRequest(httpReq)
  npkRequest.do(npkResponse)
  console.log('NPK Response')
  console.log(JSON.stringify(npkResponse))
  return httpRes.send(npkResponse)
};

module.exports = nuguReq;
