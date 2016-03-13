/**
 * Created by NoahK on 3/12/2016.
 */
Processor={
    Registers:{
        EightBit:{
            a:0,b:0,c:0,d:0,e:0,f:0,h:0,l:0//registers a-l
        },
        SixteenBit: {
            sp: 0, pc: 0, i: 0, r: 0 //special 16 bit registers
        },
        m:0, //cycles used
        ime:0 //interupts enabled*/
    },
    Clock:{
        m:0
    },
    ADD:{
        ADD8: function(n){ //pass as string
            var RegABefore=get8Reg('a'); //for flag purposes
            var RegN=get8Reg(n); //added to a
            Processor.Registers.EightBit.a+=RegN;
            if (Processor.Registers.EightBit.a>255) Processor.Registers.EightBit.f|=0x10; //set carry flag
            Processor.Registers.EightBit.a &= 255; //mask A to 8 bits
            if(Processor.Registers.EightBit.a==0) Processor.Registers.EightBit.f|=0x80; //set zero flag
            if((Processor.Registers.EightBit.a^RegN^RegABefore)&0x10) Processor.Registers.EightBit.f|=0x20; //set half carry
            Processor.Registers.m=1;
        }
    }
}

function get8Reg(x){//takes string, returns register value of register with name of string
    switch(x){
        case 'a':
            return Processor.Registers.EightBit.a;
        case 'b':
            return Processor.Registers.EightBit.b;
        case 'c':
            return Processor.Registers.EightBit.c;
        case 'd':
            return Processor.Registers.EightBit.d;
        case 'e':
            return Processor.Registers.EightBit.e;
        case 'f':
            return Processor.Registers.EightBit.f;
        case 'h':
            return Processor.Registers.EightBit.h;
        case 'l':
            return Processor.Registers.EightBit.l;
    }

}