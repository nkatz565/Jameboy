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
    this.Memory={
        bios: [
            0x31, 0xFE, 0xFF, 0xAF, 0x21, 0xFF, 0x9F, 0x32, 0xCB, 0x7C, 0x20, 0xFB, 0x21, 0x26, 0xFF, 0x0E,
            0x11, 0x3E, 0x80, 0x32, 0xE2, 0x0C, 0x3E, 0xF3, 0xE2, 0x32, 0x3E, 0x77, 0x77, 0x3E, 0xFC, 0xE0,
            0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1A, 0xCD, 0x95, 0x00, 0xCD, 0x96, 0x00, 0x13, 0x7B,
            0xFE, 0x34, 0x20, 0xF3, 0x11, 0xD8, 0x00, 0x06, 0x08, 0x1A, 0x13, 0x22, 0x23, 0x05, 0x20, 0xF9,
            0x3E, 0x19, 0xEA, 0x10, 0x99, 0x21, 0x2F, 0x99, 0x0E, 0x0C, 0x3D, 0x28, 0x08, 0x32, 0x0D, 0x20,
            0xF9, 0x2E, 0x0F, 0x18, 0xF3, 0x67, 0x3E, 0x64, 0x57, 0xE0, 0x42, 0x3E, 0x91, 0xE0, 0x40, 0x04,
            0x1E, 0x02, 0x0E, 0x0C, 0xF0, 0x44, 0xFE, 0x90, 0x20, 0xFA, 0x0D, 0x20, 0xF7, 0x1D, 0x20, 0xF2,
            0x0E, 0x13, 0x24, 0x7C, 0x1E, 0x83, 0xFE, 0x62, 0x28, 0x06, 0x1E, 0xC1, 0xFE, 0x64, 0x20, 0x06,
            0x7B, 0xE2, 0x0C, 0x3E, 0x87, 0xF2, 0xF0, 0x42, 0x90, 0xE0, 0x42, 0x15, 0x20, 0xD2, 0x05, 0x20,
            0x4F, 0x16, 0x20, 0x18, 0xCB, 0x4F, 0x06, 0x04, 0xC5, 0xCB, 0x11, 0x17, 0xC1, 0xCB, 0x11, 0x17,
            0x05, 0x20, 0xF5, 0x22, 0x23, 0x22, 0x23, 0xC9, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B,
            0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E,
            0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC,
            0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x3c, 0x42, 0xB9, 0xA5, 0xB9, 0xA5, 0x42, 0x4C,
            0x21, 0x04, 0x01, 0x11, 0xA8, 0x00, 0x1A, 0x13, 0xBE, 0x20, 0xFE, 0x23, 0x7D, 0xFE, 0x34, 0x20,
            0xF5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xFB, 0x86, 0x20, 0xFE, 0x3E, 0x01, 0xE0, 0x50
        ],
        biosDone:false,
        rom:[],
        graphicsRam:[],
        externalRam:[],
        workingRam:[],
        zeroPageRam:[],
        readByte: function(address){
            switch(address>>12){
                case 0x0000:
                    if(!PThis.Memory.biosDone){
                        return PThis.Memory.bios[address];
                    }
                    return PThis.Memory.rom[address];
                case 0x1000:
                case 0x2000:
                case 0x3000:
                    return PThis.Memory.rom[address];
                case 0x4000:
                case 0x5000:
                case 0x6000:
                case 0x7000:
                    return PThis.Memory.rom[address];
                case 0x8000:
                case 0x9000:
                    return PThis.Memory.graphicsRam[address /*& 1FFFF*/];
                case 0xA000:
                case 0xB000:
                    return PThis.Memory.externalRam[address /*& 1FFFF*/];
                case 0xC000:
                case 0xD000:
                case 0xE000:
                    return PThis.Memory.workingRam[address /*& 1FFFF*/]; //working ram and its shadow
                case 0xF000:
                    var mask=address & 0x0F00;
                    if(mask = 0xE00){
                        if(address < 0xFEA0){
                            //return oam
                        }
                        return 0; //all other oam is 0
                    }
                    else if(mask = 0xF00){
                        if(address >=0xFF80){
                            return PThis.Memory.zeroPageRam[address /* 0x7F */];
                        }
                    }
            }
        },
        read16: function (address){
            return PThis.Memory.readByte(address) + (PThis.Memory.readByte(address+1)<<8); //read and concatenate memory at address x and x+1
        },
        writeByte: function(address){

        }
    }
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
    this.LOAD={
        LOAD8RtoR: function (destination,source){ //pass as string, loads reg m into reg n. 7F 78 70 7A 7B 7C 7D 47 4F 57 5F 67 6F
            PThis.Registers.EightBit[destination]= PThis.get8Reg(source);
            PThis.Registers.m=1;
        },
        LOADfromROMatVALUE: function(s1,s2,destination){ //pass as string, reads from memory at location X. Only use with BC, DE, and HL. 0A 1A 7E
            PThis.Registers.EightBit[destination]=PThis.Memory.readByte((PThis.get8Reg(s1) << 8)+PThis.get8Reg(s2)); //concatenate values in s1 and s2 and get the value in memory
            PThis.Registers.m=2;
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

