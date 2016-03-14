/**
 * Created by NoahK on 3/12/2016.
 */
var Processor=function(){
    var PThis=this;//javascript inheritance shenanigans
    this.Registers={
        EightBit:{
            a:0,b:0,c:0,d:0,e:0,f:0,h:0,l:0//registers a-l
        },
        SixteenBit:{
            sp: 0, pc: 0, i: 0, r: 0 //special 16 bit registers
        },
        m:0, //cycles used
        IE:0 //interupts enabled*/
    };
    this.Clock={
        m:0
    };
    this.ADD={ //0x80 0x81 0x82 0x83 0x84 0x85
        ADD8: function(n){ //pass as string
            var RegABefore=PThis.get8Reg('a'); //for flag purposes
            var RegN=PThis.get8Reg(n); //added to a
            PThis.Registers.EightBit.a+=RegN;
            if (PThis.get8Reg('a')>255) PThis.Registers.EightBit.f|=0x10; //set carry flag
            PThis.Registers.EightBit.a &= 255; //mask A to 8 bits
            if(PThis.get8Reg('a')==0) PThis.Registers.EightBit.f|=0x80; //set zero flag
            if((PThis.Registers.EightBit.a^RegN^RegABefore)&0x10) PThis.Registers.EightBit.f|=0x20; //set half carry
            PThis.Registers.m=1;
        }
    };
    this.load={
        LOAD8RtoR: function (n,m){ //pass as string, loads reg m into reg n
            PThis.Registers.EightBit[n]= PThis.get8Reg(m);
        }
    };
    this.NOP= function() { //0x00
    };
    this.get8Reg=function(x){
        switch(x){
            case 'a':
                return this.Registers.EightBit.a;
            case 'b':
                return this.Registers.EightBit.b;
            case 'c':
                return this.Registers.EightBit.c;
            case 'd':
                return this.Registers.EightBit.d;
            case 'e':
                return this.Registers.EightBit.e;
            case 'f':
                return this.Registers.EightBit.f;
            case 'h':
                return this.Registers.EightBit.h;
            case 'l':
                return this.Registers.EightBit.l;
        }
    }
};
var p1 = new Processor();
/*var p2 = new Processor();
p1.Registers.EightBit.a=254;
p1.Registers.EightBit.b=2;
p2.Registers.EightBit.a=200;
p2.Registers.EightBit.b=120;
p1.ADD.ADD8('b');
p2.ADD.ADD8('b');
console.log(p1.Registers.EightBit.a);
console.log(p1.Registers.EightBit.f);
console.log(p2.Registers.EightBit.a);
console.log(p2.Registers.EightBit.f);*/

