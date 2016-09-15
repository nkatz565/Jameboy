/**
 * Created by NoahK on 3/13/2016.
 */
function dec2Bin(dec){
    var padded = (dec >>> 0).toString(2);
    while(padded.length<8){
        padded="0"+padded;//pad it to 8
    }
    return padded;
}
x = new BinFileReader('tetris.gb');
p1.Memory.rom = x.readString(x.getFileSize(), 0);

$(document).ready(function(){

    $('.step').bind( "click", function() {
        p1.run();
    })
})
function debug(){

    $('.opcode').text((p1.Registers.SixteenBit.pc).toString(16));

    $('.reg-a').text(dec2Bin(p1.Registers.EightBit.a));
    $('.reg-b').text(dec2Bin(p1.Registers.EightBit.b));
    $('.reg-c').text(dec2Bin(p1.Registers.EightBit.c));
    $('.reg-d').text(dec2Bin(p1.Registers.EightBit.d));
    $('.reg-e').text(dec2Bin(p1.Registers.EightBit.e));
    $('.reg-h').text(dec2Bin(p1.Registers.EightBit.h));
    $('.reg-l').text(dec2Bin(p1.Registers.EightBit.l));
    $('.zero').text((p1.Registers.EightBit.f & 0x80)?1:0);
    $('.subtraction').text((p1.Registers.EightBit.f & 0x40)?1:0);
    $('.half-carry').text((p1.Registers.EightBit.f & 0x20)?1:0);
    $('.carry').text((p1.Registers.EightBit.f & 0x10)?1:0);
}