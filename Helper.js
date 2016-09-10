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
//x = new BinFileReader('tetris.gb');
//p1.Memory.rom = x.readString(x.getFileSize(), 0);