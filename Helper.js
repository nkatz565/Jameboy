/**
 * Created by NoahK on 3/13/2016.
 */
function dec2Bin(dec){
    return (dec >>> 0).toString(2);
}
x = new BinFileReader('tetris.gb');
//p1.Memory.rom = x.readString(x.getFileSize(), 0);