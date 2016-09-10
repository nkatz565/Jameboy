/**
 * Created by NoahK on 3/13/2016.
 */
function dec2Bin(dec){
    x= (dec >>> 0).toString(2);
    while(x.length<8){
        x="0"+x;//pad it to 8
    }
    return x;
}
//x = new BinFileReader('tetris.gb');
//p1.Memory.rom = x.readString(x.getFileSize(), 0);