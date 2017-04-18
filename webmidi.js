var midi, state;

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}

function success (m) {
    console.log('Got midi!', m);
    midi = m
    var inputs = midi.inputs.values();
    var outputs = midi.outputs.values();

    var output = m.outputs.values().next().value;

    for (var input = inputs.next();
        input && !input.done;
        input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }

    function blinkMidiPad() {
        state = false;
        setInterval(blink, 1000);
    }

    function blink() {
        state = !state;
        var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
  
        if(state) {
            output.send( new Uint8Array ([144, 52, 127]) );
        }else{
            output.send( new Uint8Array ([144, 52, 0]) )
        }
        console.log(state); 
    }

    blinkMidiPad();
}
 
function failure () {
    console.error('No access to your midi devices.')
}

function onMIDIMessage (message) {
    console.log(message.data);
}
