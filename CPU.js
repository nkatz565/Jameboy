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
        IE:0 //interupts enabled register. Determines which interupts are currently allowed*/
    };
	this.IME=true; //MASTER INTERUPT ENABLE. ALLOWS INTERUPTS TO OCCUR.
	this.IF={
        interupt:false,
        VBlank:false,
        LCDS:false,
        TIMER:false,
        Button:false
    }; //interupt flags. Determines if an interupt must be processed

    this.clock=0;
    this.graphicsTimings={
        ly:0
    }
	this.run = function(){
        if(PThis.Registers.SixteenBit.pc==0x27ea){
            console.log('break');
        }
        PThis.map(PThis.Memory.readByte(PThis.Registers.SixteenBit.pc));
        PThis.Registers.SixteenBit.pc++;
        PThis.Registers.SixteenBit.pc &= 65535;
        PThis.clock+=PThis.Registers.m;
        PThis.updateTiming();
        if(PThis.IME && PThis.IF.interupt){
            PThis.interruptHandler();
        }
        //debug();
		//run function
		//increment pc after
	}
    this.interruptHandler = function(){
        var enabled = PThis.Memory.readByte(0xFFFF);

        PThis.IF.interupt=false;
        if(PThis.IF.VBlank && (enabled&&0x01)){
            PThis.IF.VBlank=false;
            PThis.IME=false;
            PThis.Registers.SixteenBit.pc=0x0040;
        }
    }

    this.updateTiming = function(){
        PThis.graphicsTimings.ly=(Math.floor(PThis.clock*4)/456);
        if((PThis.clock *4) >= 70224){
            PThis.clock=0;
            PThis.IF.interupt=true;
            PThis.IF.VBlank=true;
        }
    }

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
        biosDone:true,
        rom:[],
        graphicsRam:[],
        externalRam:[],
        workingRam:[],
        zeroPageRam:[],
        readByte: function(address){
            switch(address>>12){
                case 0x0:
                    if(!PThis.Memory.biosDone){
                        return PThis.Memory.bios[address];
                    }
                    return PThis.Memory.rom.charCodeAt(address)
                case 0x1: case 0x2: case 0x3:
                    return PThis.Memory.rom.charCodeAt(address)
                case 0x4: case 0x5: case 0x6: case 0x7:
                    return PThis.Memory.rom.charCodeAt(address)
                case 0x8: case 0x9:
                    return PThis.Memory.graphicsRam[address /*& 1FFFF*/];
                case 0xA: case 0xB:
                    return PThis.Memory.externalRam[address /*& 1FFFF*/];
                case 0xC: case 0xD: case 0xE:
                    return PThis.Memory.workingRam[address /*& 1FFFF*/]; //working ram and its shadow
                case 0xF:
                    var mask=address & 0x0F00;
                    if(mask = 0xE00){
                        if(address < 0xFEA0){
                            //return oam
                        }
                        if(address==0xFF44){
                            return PThis.graphicsTimings.ly;
                        }
                        return 0; //all other oam is 0
                    }
                    else if(mask = 0xF00){
                        //interupts and stuff go here
						if(address ==0xFFFF){
							return PThis.Registers.IE;
						}
                        if(address > 0xFF80){
                            return PThis.Memory.zeroPageRam[address];
                        }

                    }
                    else{
                        return PThis.Memory.workingRam[address];
                    }
            }
        },
        readWord: function (address){
            var toReturn = PThis.Memory.readByte(address) + (PThis.Memory.readByte(address+1)<<8); //read and concatenate memory at address x and x+1
            PThis.Registers.SixteenBit.pc+=1;
            return toReturn;
        },
        writeByte: function(address, value){
            switch(address>>12) {
                case 0x0: case 0x1: case 0x2: case 0x3: case 0x4: case 0x5: case 0x6: case 0x7:
                    PThis.Memory.rom[address]=value; return;
                case 0x8: case 0x9:
                    PThis.Memory.graphicsRam[address]=value; return;
                case 0xA: case 0xB:
                    PThis.Memory.externalRam[address]=value; return;
                case 0xC: case 0xD: case 0xE:
                    PThis.Memory.workingRam[address]=value; return;
                case 0xF:
                    var mask=address & 0x0F00;
                    if(mask = 0xE00){
                    }
                    else if(mask = 0xF00){
                        if(address==0xFF44){
                            PThis.graphicsTimings.ly=value;
                        }
                    }
                    else{
                        PThis.Memory.workingRam[address]=value;
                    }
            }
        },
		writeWord: function (address, value){
			PThis.Memory.writeByte(address,value&255); 
			PThis.Memory.writeByte(address+1,value>>8); 
		}
    };
    this.Clock={
        m:0
    };
    this.GPU={
        ScrollX:0,
        ScrollY:0
    };
	this.Interupts = function(bool){ //mostly wrong
		PThis.IME=bool;
	};
    STOP=0;
    HALT=0;
    this.MISC={
        NOP: function() { //00
        },
        STOP: function(){ //10
            PThis.STOP=1;
        },
        DAA: function() { //http://www.worldofspectrum.org/faq/reference/z80reference.htm. 27
            var f = PThis.Registers.EightBit.f;
            if (!(f&0x40)) {
                if((f&0x10) || PThis.Registers.EightBit.a > 0x99) {
                    PThis.Registers.EightBit.PThis.Registers.EightBit.a = (PThis.Registers.EightBit.a + 0x60) & 0xFF;
                    PThis.FLAGS.SETx('c');
                }
                if ((f & 0x20) || ((PThis.Registers.EightBit.a) & 0xF) > 0x9) {
                    PThis.Registers.EightBit.a = (PThis.Registers.EightBit.a + 0x06) & 0xFF;
                    PThis.FLAGS.CLEARx('h');
                }
            }
            else if ((f & 0x10) && (f & 0x20)) {
                PThis.Registers.EightBit.a = ((PThis.Registers.EightBit.a + 0x9A) & 0xFF);
                PThis.FLAGS.CLEARx('h');
            }
            else if (f & 0x10) {
                PThis.Registers.EightBit.a = ((PThis.Registers.EightBit.a + 0xA0) & 0xFF);
            }
            else if (f & 0x20) {
                PThis.Registers.EightBit.a = ((PThis.Registers.EightBit.a + 0xFA) & 0xFF);
                PThis.FLAGS.CLEARx('h');
            }
            PThis.Registers.EightBit.a ? PThis.FLAGS.CLEARx('z') : PThis.FLAGS.SETx('z');
            PThis.Registers.m=1;
        },
        CPL: function(){ //2F
            PThis.Registers.EightBit.a = (~(PThis.Registers.EightBit.a))&0xFF;
            PThis.FLAGS.SETx('n');
            PThis.FLAGS.SETx('h');
            PThis.Registers.m=1;
        },
        SCF: function(){ //37
            PThis.FLAGS.SETx('c');
            PThis.FLAGS.CLEARx('h');
            PThis.FLAGS.CLEARx('n');
            PThis.Registers.m=1;
        },
        CCF: function(){ //3F
            ((PThis.Registers.EightBit.f)&0x10)?PThis.FLAGS.CLEARx('c'):PThis.FLAGS.SETx('c');
            PThis.FLAGS.CLEARx('h');
            PThis.FLAGS.CLEARx('n');
            PThis.Registers.m=1;
        },
		CALL: function(){ //CD
			PThis.Registers.SixteenBit.sp -= 2;
			PThis.Registers.SixteenBit.pc++;
			PThis.Memory.writeWord(PThis.Registers.SixteenBit.sp, PThis.Registers.SixteenBit.pc+2);
			PThis.Registers.SixteenBit.pc=PThis.Memory.readWord(PThis.Registers.SixteenBit.pc);
            PThis.Registers.SixteenBit.pc-=1; //adjusting for the generalized read function
            PThis.Registers.m=3;
		},
		CALLif: function(x){ //C4 CC D4 DC
			var call=0;
            switch (x) {
                case 'nz':
                    if((PThis.Registers.EightBit.f&0x80)==0) call=1;
                    break;
                case 'z':
                    if(PThis.Registers.EightBit.f&0x80) call=1;
                    break;
                case 'nc':
                    if((PThis.Registers.EightBit.f&0x10)==0) call=1;
                    break;
                case 'c':
                    if(PThis.Registers.EightBit.f&0x10) call=1;
                    break;
            }
            if(call){
                PThis.MISC.CALL();
            }
		}
    };
	this.STACK={
		POP: function (dest1, dest2){ //use BC DE HL AF. C1, D1, E1, F1
			PThis.Registers.EightBit[dest2]=PThis.Memory.readByte(PThis.Registers.SixteenBit.sp++);
            PThis.Registers.EightBit[dest1]=PThis.Memory.readByte(PThis.Registers.SixteenBit.sp++);
            PThis.Registers.m=3;
		},
		PUSH: function (s1, s2){ //use BC DE HL AF. C5 D5 E5 F5
			PThis.Memory.writeByte(--PThis.Registers.SixteenBit.sp, PThis.Registers.EightBit[s1]);
			PThis.Memory.writeByte(--PThis.Registers.SixteenBit.sp, PThis.Registers.EightBit[s2]);
			PThis.Registers.m=4;
		}
	};
    this.ADD={ 
        ADD8: function (n) { //pass as string //0x80 0x81 0x82 0x83 0x84 0x85
            PThis.FLAGS.CLEARall();
            var RegABefore=PThis.get8Reg('a'); //for flag purposes
            var RegN=PThis.get8Reg(n); //added to a
            PThis.Registers.EightBit.a+=RegN;
            if (PThis.get8Reg('a')>255) PThis.FLAGS.SETx('c'); //set carry flag
            PThis.Registers.EightBit.a &= 0xFF; //mask A to 8 bits
            if (PThis.get8Reg('a')==0) PThis.FLAGS.SETx('z'); //set zero flag
            if((PThis.Registers.EightBit.a^RegN^RegABefore)&0x10) PThis.FLAGS.SETx('h'); //set half carry
            PThis.Registers.m=1;
        },
		ADDd8: function(){ //C6
			PThis.FLAGS.CLEARall();
            var RegABefore=PThis.get8Reg('a'); //for flag purposes
            var RegN= PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc); //added to a
			PThis.Registers.EightBit.a+=RegN;
            if (PThis.get8Reg('a')>255) PThis.FLAGS.SETx('c'); //set carry flag
            PThis.Registers.EightBit.a &= 0xFF; //mask A to 8 bits
            if (PThis.get8Reg('a')==0) PThis.FLAGS.SETx('z'); //set zero flag
            if((PThis.Registers.EightBit.a^RegN^RegABefore)&0x10) PThis.FLAGS.SETx('h'); //set half carry
            PThis.Registers.m=2;
		},
        ADD8C: function(n){ //88 89 8A 8B 8C 8D 8F
            var addC = ((PThis.Registers.EightBit.f)&0x10)?1:0;
            PThis.FLAGS.CLEARall();
            var RegABefore=PThis.get8Reg('a'); 
            var RegN=PThis.get8Reg(n)+addC; 
            PThis.Registers.EightBit.a+=RegN;
            if (PThis.get8Reg('a')>255) PThis.FLAGS.SETx('c'); 
            PThis.Registers.EightBit.a &= 0xFF; 
            if (PThis.get8Reg('a')==0) PThis.FLAGS.SETx('z'); 
            if((PThis.Registers.EightBit.a^RegN^RegABefore)&0x10) PThis.FLAGS.SETx('h'); 
            PThis.Registers.m=1;
        },
		ADDd8C: function(){ //CE
            var addC = ((PThis.Registers.EightBit.f)&0x10)?1:0;
            PThis.FLAGS.CLEARall();
            var RegABefore=PThis.get8Reg('a'); 
            var RegN=PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc)+addC; 
            PThis.Registers.EightBit.a+=RegN;
            if (PThis.get8Reg('a')>255) PThis.FLAGS.SETx('c'); 
            PThis.Registers.EightBit.a &= 0xFF; 
            if (PThis.get8Reg('a')==0) PThis.FLAGS.SETx('z'); 
            if((PThis.Registers.EightBit.a^RegN^RegABefore)&0x10) PThis.FLAGS.SETx('h'); 
            PThis.Registers.m=1;
        },
        ADD16toHL: function(s1, s2){ //only use combinations of BC, DE, HL. 09 19 29
            var hl=(PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
            var xy=(PThis.get8Reg(s1)<<8)+PThis.get8Reg(s2);
            var add=hl+xy;
            PThis.FLAGS.CLEARx('n');
            (add>0xffff)? PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
            add&=0xffff;
            PThis.Registers.EightBit.h=add>>8;
            PThis.Registers.EightBit.l=add&255;
            ((hl^xy^add)&0x800) ? PThis.FLAGS.SETx('h'):PThis.FLAGS.CLEARx('h');
            PThis.Registers.m=2;
        },
        ADDSPtoHL: function(){ //39
            var hl=(PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
            var sp=PThis.Registers.SixteenBit.sp;
            var add=hl+sp;
            PThis.FLAGS.CLEARx('n');
            (add>0xffff)? PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
            add&=0xffff;
            PThis.Registers.EightBit.h=add>>8;
            PThis.Registers.EightBit.l=add&255;
            ((hl^sp^add)&0x800) ? PThis.FLAGS.SETx('h'):PThis.FLAGS.CLEARx('h');
            PThis.Registers.m=2;
        },
        ADDatHLtoA: function () { //86
            PThis.FLAGS.CLEARall();
            var RegABefore = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l'));
            PThis.Registers.EightBit.a += hl;
            if (PThis.get8Reg('a') > 255) PThis.FLAGS.SETx('c');
            PThis.Registers.EightBit.a &= 0xFF; 
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z'); 
            if ((PThis.Registers.EightBit.a ^ hl ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 2;
        },
        ADDatHLtoAC: function () { //8E
            var addC = ((PThis.Registers.EightBit.f) & 0x10) ? 1 : 0;
            PThis.FLAGS.CLEARall();
            var RegABefore = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l')) + addC;
            PThis.Registers.EightBit.a += hl;
            if (PThis.get8Reg('a') > 255) PThis.FLAGS.SETx('c');
            PThis.Registers.EightBit.a &= 0xFF;
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z');
            if ((PThis.Registers.EightBit.a ^ hl ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 2;
        },
		ADDspn: function () { //E8
            PThis.FLAGS.CLEARall();
			
			var imm=PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            if(imm>127) imm=-((~imm+1)&255);

            var sp=PThis.Registers.SixteenBit.sp; 

			var result = (sp+imm)&0xFFFF;
			var temp = sp ^ imm ^ result;
			
			PThis.Registers.SixteenBit.sp=result;
			
			if((temp &0x100)==0x100) PThis.FLAGS.SETx('c');
			if((temp &0x10)==0x10) PThis.FLAGS.SETx('h');
        }
    };
    this.SUB = { 
        SUB8: function (n) { //90 91 92 93 94 95 97
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a'); 
            var RegN = PThis.get8Reg(n); 
            PThis.Registers.EightBit.a -= RegN;
            if (PThis.get8Reg('a') < 0) PThis.FLAGS.SETx('c'); 
            PThis.Registers.EightBit.a &= 0xFF; 
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z'); 
            if ((PThis.Registers.EightBit.a ^ RegN ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 1;
        },
		SUBd8: function () { //D6
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a'); 
            var RegN = PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc); 
            PThis.Registers.EightBit.a -= RegN;
            if (PThis.get8Reg('a') < 0) PThis.FLAGS.SETx('c'); 
            PThis.Registers.EightBit.a &= 0xFF; 
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z'); 
            if ((PThis.Registers.EightBit.a ^ RegN ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 1;
        },
        SUB8C: function (n) { //98 99 9A 9B 9C 9D 9F
            var subC = ((PThis.Registers.EightBit.f) & 0x10) ? 1 : 0;
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a');
            var RegN = PThis.get8Reg(n) + subC;
            PThis.Registers.EightBit.a -= RegN;
            if (PThis.get8Reg('a') < 0) PThis.FLAGS.SETx('c');
            PThis.Registers.EightBit.a &= 0xFF;
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z');
            if ((PThis.Registers.EightBit.a ^ RegN ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 1;
        },
		SUBd8C: function (n) { //DE
            var subC = ((PThis.Registers.EightBit.f) & 0x10) ? 1 : 0;
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a');
            var RegN = PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc) + subC;
            PThis.Registers.EightBit.a -= RegN;
            if (PThis.get8Reg('a') < 0) PThis.FLAGS.SETx('c');
            PThis.Registers.EightBit.a &= 0xFF;
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z');
            if ((PThis.Registers.EightBit.a ^ RegN ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 1;
        },
        SUBatHLtoA: function (n) { //96
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l'));
            PThis.Registers.EightBit.a -= hl;
            if (PThis.get8Reg('a') < 0) PThis.FLAGS.SETx('c');
            PThis.Registers.EightBit.a &= 0xFF;
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z');
            if ((PThis.Registers.EightBit.a ^ hl ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 2;
        },
        SUBatHLtoAC: function (n) { //9E
            var subC = ((PThis.Registers.EightBit.f) & 0x10) ? 1 : 0;
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l')) + subC;
            PThis.Registers.EightBit.a -= hl;
            if (PThis.get8Reg('a') < 0) PThis.FLAGS.SETx('c');
            PThis.Registers.EightBit.a &= 0xFF;
            if (PThis.get8Reg('a') == 0) PThis.FLAGS.SETx('z');
            if ((PThis.Registers.EightBit.a ^ hl ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 2;
        }
    }
    this.AND = {
        ANDN: function (n) { //A0 A1 A2 A3 A4 A5 A7
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var RegN = PThis.get8Reg(n);
            PThis.Registers.EightBit.a = RegA & RegN;
            PThis.FLAGS.SETx('h');
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 1;
        },
		ANDd8: function () { //E6
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var RegN = PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            PThis.Registers.EightBit.a = RegA & RegN;
            PThis.FLAGS.SETx('h');
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 1;
        },
        ANDHL: function () { //A6
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l'));
            PThis.Registers.EightBit.a = RegA & hl;
            PThis.FLAGS.SETx('h');
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 2;
        }
    }
    this.XOR = {
        XORN: function (n) { //A8 A9 AA AB AC AD AF
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var RegN = PThis.get8Reg(n);
            PThis.Registers.EightBit.a = RegA ^ RegN;
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 1;
        },
		XORd8: function (n) { //EE
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var RegN = PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            PThis.Registers.EightBit.a = RegA ^ RegN;
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 1;
        },
        XORHL: function (n) { //AE
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l'));
            PThis.Registers.EightBit.a = RegA ^ hl;
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 2;
        }
    }
    this.OR = {
        ORN: function (n) { //B0 B1 B2 B3 B4 B5 B7
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var RegN = PThis.get8Reg(n);
            PThis.Registers.EightBit.a = RegA | RegN;
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 1;
        },
		ORd8: function () { //F6
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var RegN = PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            PThis.Registers.EightBit.a = RegA | RegN;
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 1;
        },
        ORHL: function (n) { //B6
            PThis.FLAGS.CLEARall();
            var RegA = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l'));
            PThis.Registers.EightBit.a = RegA | hl;
            if (!PThis.Registers.EightBit.a) PThis.FLAGS.SETx('z');
            PThis.Registers.m = 2;
        }
    }
    this.CP = {
        CPN: function (n) { //B8 B9 BA BB BC BD BF
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a');
            var RegN = PThis.get8Reg(n);
            var RegAAfter = RegABefore - RegN;
            if (RegAAfter < 0) PThis.FLAGS.SETx('c');
            RegAAfter &= 0xFF;
            if (RegAAfter == 0) PThis.FLAGS.SETx('z');
            if ((RegAAfter ^ RegN ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 1;
        },
		CPd8: function () { //FE
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a');
            var RegN = PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            var RegAAfter = RegABefore - RegN;
            if (RegAAfter < 0) PThis.FLAGS.SETx('c');
            RegAAfter &= 0xFF;
            if (RegAAfter == 0) PThis.FLAGS.SETx('z');
            if ((RegAAfter ^ RegN ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 1;
        },
        CPHL: function () { //BE
            PThis.FLAGS.CLEARall();
            PThis.FLAGS.SETx('n');
            var RegABefore = PThis.get8Reg('a');
            var hl = PThis.Memory.readByte((PThis.get8Reg('h') << 8) + PThis.get8Reg('l'));
            var RegAAfter = RegABefore - hl;
            if (RegAAfter < 0) PThis.FLAGS.SETx('c');
            RegAAfter &= 0xFF;
            if (RegAAfter == 0) PThis.FLAGS.SETx('z');
            if ((RegAAfter ^ hl ^ RegABefore) & 0x10) PThis.FLAGS.SETx('h');
            PThis.Registers.m = 2;
        }
    }
    
    this.LOAD={
        LOAD8RtoR: function (destination,source){ //pass as string, loads reg m into reg n. 7F 78 70 7A 7B 7C 7D 47 4F 57 5F 67 6F
            PThis.Registers.EightBit[destination]= PThis.get8Reg(source);
            PThis.Registers.m=1;
        },
        LOAD8IM: function (dest1){ //06 0E 16 1E 26 2E 3E
            PThis.Registers.EightBit[dest1]=PThis.Memory.readByte(++(PThis.Registers.SixteenBit.pc));
            PThis.Registers.m=2;
        },
        LOADfrom16RtoA: function(s1,s2){ //pass as string, reads from memory at location X. Only use with BC, DE, and HL. 0A 1A 7E
            PThis.Registers.EightBit.a=PThis.Memory.readByte((PThis.get8Reg(s1) << 8)+PThis.get8Reg(s2)); //concatenate values in s1 and s2 and get the value in memory
            PThis.Registers.m=2;
        },
        LOAD16IM: function (dest1,dest2){ //only use combinations of BC, DE, HL. 01 11 21
            PThis.Registers.SixteenBit.pc++;
            PThis.Registers.EightBit[dest2]=PThis.Memory.readByte(PThis.Registers.SixteenBit.pc);
            PThis.Registers.EightBit[dest1]=PThis.Memory.readByte(PThis.Registers.SixteenBit.pc+1);
            PThis.Registers.SixteenBit.pc++;
            PThis.Registers.m=3;
        },
        LOAD16IMSP: function(){ //31
            PThis.Registers.SixteenBit.sp=PThis.Memory.readWord(++PThis.Registers.SixteenBit.pc);
            PThis.Registers.m=3;
        },
        LOADaAT16: function (dest1, dest2) { //only use combinations of BC, DE, HL. 02 12 77
            PThis.Memory.writeByte((PThis.Registers.EightBit[dest1]<<8)+PThis.Registers.EightBit[dest2],PThis.Registers.EightBit.a);
            PThis.Registers.m=2;
        },
        LOADspA16: function (){ //08
            var address = PThis.Memory.readWord(++(PThis.Registers.SixteenBit.pc));
            PThis.Memory.writeByte(address,(PThis.Registers.SixteenBit.sp)&0xFF); //write lower 8 bits of SP at a16
            PThis.Memory.writeByte(address+1,(PThis.Registers.SixteenBit.sp)>>8); //write higher 8 bits of SP at a16+1
            PThis.Registers.m=5;
        },
        LOADaAThlTHEN: function (INC){ //set INC to true to increment hl, and to false to decrement it. 22, 32
            var hl = (PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
            PThis.Memory.writeByte(hl,PThis.get8Reg('a'));
            INC?(hl=(hl+1)&0xFFFF):(hl=(hl-1)&0xFFFF);
            PThis.Registers.EightBit.h = hl >> 8;
            PThis.Registers.EightBit.l = hl&0xFF;
            PThis.Registers.m=2;
        },
        LOADhlINTOaTHEN: function (INC){ //set INC to true to increment hl, and to false to decrement it. 2A, 3A
            var hl = (PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
            PThis.Registers.EightBit.a=PThis.Memory.readByte(hl);
            INC?(hl=(hl+1)&0xFFFF):(hl=(hl-1)&0xFFFF);
            PThis.Registers.EightBit.h = hl >> 8;
            PThis.Registers.EightBit.l = hl&0xFF;
            PThis.Registers.m=2;
        },
        LOAD8IMatHL: function(){ //36
            var hl = (PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
            var value=PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            PThis.Memory.writeByte(hl,value);
            PThis.Registers.m=2;
        },
        LOAD8FROMaddressAThl: function(dest1){ //46 4E 56 5E 66 6E 7E
            var hl = (PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
            PThis.Registers.EightBit[dest1] = PThis.Memory.readByte(hl);
            PThis.Registers.m=2;
        },
        LOADrATaddressHL: function(s1){ //70 71 72 73 74 75 77
            var hl = (PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
            PThis.Memory.writeByte(hl,PThis.get8Reg(s1));
            PThis.Registers.m=2;
        },
		LOADaATimm: function(){ //EA
			PThis.Registers.SixteenBit.pc++;
			PThis.Memory.writeByte(PThis.Memory.readWord(PThis.Registers.SixteenBit.pc),PThis.Registers.EightBit.a);
			PThis.Registers.m=4;
		},
		LOADimmTOa: function(){ //FA
			PThis.Registers.SixteenBit.pc++;
			PThis.Registers.EightBit.a=PThis.Memory.readByte(PThis.Memory.readWord(PThis.Registers.SixteenBit.pc));
			PThis.Registers.m=4;
		},
		LDHto: function(){ //E0
			PThis.Registers.SixteenBit.pc++;
			PThis.Memory.writeByte(0xFF00+PThis.Memory.readByte(PThis.Registers.SixteenBit.pc), PThis.Registers.EightBit.a);
			PThis.Registers.m=3;
		},
		LDHfrom: function(){ //F0
			PThis.Registers.SixteenBit.pc++;
			PThis.Registers.EightBit.a = PThis.Memory.readByte(0xFF00+PThis.Memory.readByte(PThis.Registers.SixteenBit.pc));
			PThis.Registers.m=3;
		},
		LDCto: function(){ //E2
			PThis.Memory.writeByte(0xFF00+PThis.Registers.EightBit.c, PThis.Registers.EightBit.a);
			PThis.Registers.m=2;
		},
		LDCfrom: function(){ //F2
			PThis.Registers.EightBit.a = PThis.Memory.readByte(0xFF00+PThis.Registers.EightBit.c);
			PThis.Registers.m=2;
		},
		LOADtoHLspPLUSn: function(){ //F8
			var n=PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            if(n>127) n=-((~n+1)&255);

            var newHL = (PThis.Registers.SixteenBit.sp + n) &0xFFFF;
			n = n ^ PThis.Registers.SixteenBit.sp ^ newHL;
			PThis.FLAGS.CLEARall();
			if ((n & 0x100) == 0x100) PThis.FLAGS.SETx('f');
			if ((n & 0x10) == 0x10) PThis.FLAGS.SETx('h');
			PThis.Registers.EightBit.h = newHL >> 8;
            PThis.Registers.EightBit.l = newHL & 0xFF;
			PThis.Registers.m=3;			
		},
		LOADtoSPhl: function(){ //F9
			var hl = (PThis.get8Reg('h')<<8)+PThis.get8Reg('l');
			PThis.Registers.SixteenBit.sp=hl;
			PThis.Registers.m=2;
		}
    };
    this.INC={
        INC16: function (s1,s2){ //only use combinations of BC, DE, HL. 03 13 23
            if(++PThis.Registers.EightBit[s2]>255){
                PThis.Registers.EightBit[s2]&=255;
                PThis.Registers.EightBit[s1]=(++PThis.Registers.EightBit[s1])&255;
                PThis.Registers.m=2;
            }
        },
        INC8: function (s1) { //3C 04 0C 14 1C 24 2C
            var regBefore = PThis.Registers.EightBit[s1];
            PThis.Registers.EightBit[s1] = (++PThis.Registers.EightBit[s1]) & 255;
            (PThis.Registers.EightBit[s1]) ? PThis.FLAGS.CLEARx('z') : PThis.FLAGS.SETx('z');
            ((p1.Registers.EightBit[s1] ^ 1 ^ regBefore) & 0x10) ? PThis.FLAGS.SETx('h') : PThis.FLAGS.CLEARx('h');
            PThis.FLAGS.CLEARx('n');
            PThis.Registers.m=1;
        },
        INCSP: function(){ // 33
            PThis.Registers.SixteenBit.sp=(++PThis.Registers.SixteenBit.sp)&0xFFFF;
        },
        INCatHL: function(){ // 34
            var hl = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
            var valueBefore = PThis.Memory.readByte(hl);
            var valueAfter = (valueBefore+1)&0xFF;
            valueAfter ? PThis.FLAGS.CLEARx('z') : PThis.FLAGS.SETx('z');
            ((valueAfter ^ 1 ^ valueBefore) & 0x10) ? PThis.FLAGS.SETx('h') : PThis.FLAGS.CLEARx('h');
            PThis.FLAGS.CLEARx('n');
            PThis.Memory.writeByte(hl,valueAfter);
            PThis.Registers.m=3;
        }
    };
    this.DEC={
        DEC16:function(s1,s2){ //only use combinations of BC, DE, HL. 0B 1B 2B
            PThis.Registers.EightBit[s1]=(--PThis.Registers.EightBit[s1])&0xFF;
            if(PThis.Registers.EightBit[s1]==255) PThis.Registers.EightBit[s2]= (--PThis.Registers.EightBit[s2])&0xFF;
            PThis.Registers.m=2;
        },
        DEC8:function(s1){ //3D 05 0D 15 1D 25 2D
            regBefore = PThis.Registers.EightBit[s1];
            PThis.Registers.EightBit[s1] = (--PThis.Registers.EightBit[s1])&255;
            (PThis.Registers.EightBit[s1]) ? PThis.FLAGS.CLEARx('z') : PThis.FLAGS.SETx('z');
            ((p1.Registers.EightBit[s1] ^ -1 ^ regBefore) & 0x10) ? PThis.FLAGS.SETx('h') : PThis.FLAGS.CLEARx('h');
            PThis.FLAGS.SETx('n');
            PThis.Registers.m=1;
        },
        DECatHL: function(){ //35
            var hl = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
            var valueBefore = PThis.Memory.readByte(hl);
            var valueAfter = (valueBefore-1)&0xFF;
            valueAfter ? PThis.FLAGS.CLEARx('z') : PThis.FLAGS.SETx('z');
            ((valueAfter ^ -1 ^ valueBefore) & 0x10) ? PThis.FLAGS.SETx('h') : PThis.FLAGS.CLEARx('h');
            PThis.FLAGS.CLEARx('n');
            PThis.Memory.writeByte(hl,valueAfter);
            PThis.Registers.m=3;
        },
        DECsp: function(){ //3B
            PThis.Registers.SixteenBit.sp=(--PThis.Registers.SixteenBit.sp)&0xFFFF;
            PThis.Registers.m=2;
        }
    };
    this.ROTATE={
        RLCA:function(){ //07
            var A = PThis.Registers.EightBit.a;
            var carryBit = (A&0x80)?1:0;
            var newA = ((A<<1)+carryBit)&255;
            PThis.FLAGS.CLEARall();
            carryBit==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
            PThis.Registers.EightBit.a = newA;
            PThis.Registers.m=1;
        },
        RRCA:function(){ //0F
            var A = PThis.Registers.EightBit.a;
            var carryBit = (A&0x01)?1:0;
            var newA = ((A>>1)+carryBit*0x80)&255;
            PThis.FLAGS.CLEARall();
            carryBit==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
            PThis.Registers.EightBit.a = newA;
            PThis.Registers.m=1;
        },
        RLA:function(){ //17
            var A = PThis.Registers.EightBit.a;
            var newCarry = (A&0x80)?1:0;
            var newBit = (PThis.Registers.EightBit.f&0x10)?1:0;
            var newA = ((A<<1)+newBit)&255;
            PThis.FLAGS.CLEARall();
            newCarry==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
            PThis.Registers.EightBit.a = newA;
            PThis.Registers.m=1;
        },
        RRA:function(){ //1F
            var A = PThis.Registers.EightBit.a;
            var newCarry = (A&0x01)?1:0;
            var newBit = (PThis.Registers.EightBit.f&0x10)?1:0;
            var newA = ((A>>1)+newBit*0x80)&255;
            PThis.FLAGS.CLEARall();
            newCarry==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
            PThis.Registers.EightBit.a = newA;
            PThis.Registers.m=1;
        }
		
    };
    this.JUMP={
        JUMPr8: function(){ //18
            var jumpDistance = PThis.Memory.readByte(++PThis.Registers.SixteenBit.pc);
            if(jumpDistance>127) jumpDistance=-((~jumpDistance+1)&255);
            PThis.Registers.SixteenBit.pc+=jumpDistance;
            PThis.Registers.m=2;
        },
        JUMPrIFcc: function(x) { //use with nz z nc c. 20 28 30 38
            var jump=0;
            switch (x) {
                case 'nz':
                    if((PThis.Registers.EightBit.f&0x80)==0) jump=1;
                    break;
                case 'z':
                    if(PThis.Registers.EightBit.f&0x80) jump=1;
                    break;
                case 'nc':
                    if((PThis.Registers.EightBit.f&0x10)==0) jump=1;
                    break;
                case 'c':
                    if(PThis.Registers.EightBit.f&0x10) jump=1;
                    break;
            }
            if(jump){
                PThis.JUMP.JUMPr8();
            }
            else{
                PThis.Registers.SixteenBit.pc++;//skip the 8 bit address even if you don't jump
            }
        },
		JUMPhl: function () { //E9
            var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
            PThis.Registers.SixteenBit.pc=address;
            PThis.Registers.m = 1;
        },
        JUMPa16: function () { //C3
            var address = PThis.Memory.readWord(++(PThis.Registers.SixteenBit.pc));
            PThis.Registers.SixteenBit.pc=address;
            PThis.Registers.m = 3;
        },
		JUMPa16if: function(x){ //C2 CA D2 DA
			var jump=0;
            switch (x) {
                case 'nz':
                    if((PThis.Registers.EightBit.f&0x80)==0) jump=1;
                    break;
                case 'z':
                    if(PThis.Registers.EightBit.f&0x80) jump=1;
                    break;
                case 'nc':
                    if((PThis.Registers.EightBit.f&0x10)==0) jump=1;
                    break;
                case 'c':
                    if(PThis.Registers.EightBit.f&0x10) jump=1;
                    break;
            }
            if(jump){
                PThis.JUMP.JUMPa16();
            }
		},
		RET: function(){//c9
			PThis.Registers.SixteenBit.pc=PThis.Memory.readWord(PThis.Registers.SixteenBit.sp)
			PThis.Registers.SixteenBit.sp+=2;
			PThis.Registers.m = 3;
		},
		RETifCC: function(x){ //C0 C8 D0 D8
			var ret=0;
            switch (x) {
                case 'nz':
                    if((PThis.Registers.EightBit.f&0x80)==0) ret=1;
                    break;
                case 'z':
                    if(PThis.Registers.EightBit.f&0x80) ret=1;
                    break;
                case 'nc':
                    if((PThis.Registers.EightBit.f&0x10)==0) ret=1;
                    break;
                case 'c':
                    if(PThis.Registers.EightBit.f&0x10) ret=1;
                    break;
            }
            if(ret){
                PThis.JUMP.RET();
            }
		},
		RETI: function(){ //D9 mostly wrong
			PThis.JUMP.RET();
			PThis.Interupts(true);
			PThis.Registers.m = 2;
		}
    };
	this.RESET={
		RST: function(addr) { //use only (hex) 00 08 10 18 20 28 30 38. C7 CF D7 DF E7 EF F7 FF
			PThis.Registers.SixteenBit.sp -=2;
			PThis.Memory.writeWord(PThis.Registers.SixteenBit.sp,PThis.Registers.SixteenBit.pc);
			PThis.Registers.SixteenBit.pc=addr;
			PThis.Registers.m = 8;
		}
	}
	
	this.CB = function(){ //CB UNFINISHED
		PThis.Registers.SixteenBit.pc++;
		PThis.Registers.SixteenBit.pc &= 65535;
		opcode=PThis.Memory.readByte(PThis.Registers.SixteenBit.pc);
        PThis.CBmap(opcode);
        PThis.Registers.m++; //mapping takes a cycle in addition to whatever gets mapped
	}
	
	this.CBtable = {
		ROTATE: {
			RLCn: function (n){ //CB00 CB01 CB02 CB03 CB04 CB05 CB07
                var N = PThis.Memory.readByte(address);
                var carryBit = (N&0x80)?1:0;
                var newN = ((N<<1)+carryBit)&255;
                PThis.FLAGS.CLEARall();
                carryBit==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
                if (newN==0) PThis.FLAGS.SETx('z');
				PThis.Registers.EightBit[n] = newN;
				PThis.Registers.m=2;
			},
			RLCatHL: function(){ //CB06
				var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
				var N = PThis.Memory.readByte(address);
				var carryBit = (N&0x80)?1:0;
				var newN = ((N<<1)+carryBit)&255;
				PThis.FLAGS.CLEARall();
				carryBit==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
				if (newN==0) PThis.FLAGS.SETx('z');
				PThis.Memory.writeByte(address, newN);
				PThis.Registers.m=4;
			},
			RLn:function(n){ //CB10 CB11 CB12 CB13 CB14 CB15 CB17
				var N = PThis.Registers.EightBit[n];
				var newCarry = (N&0x80)?1:0;
				var newBit = (PThis.Registers.EightBit.f&0x10)?1:0;
				var newN = ((N<<1)+newBit)&255;
				PThis.FLAGS.CLEARall();
				newCarry==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
				if (newN==0) PThis.FLAGS.SETx('z');
				PThis.Registers.EightBit[n] = newN;
				PThis.Registers.m=2;
			},
            RLatHL:function(){ //CB16
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                var newCarry = (N&0x80)?1:0;
                var newBit = (PThis.Registers.EightBit.f&0x10)?1:0;
                var newN = ((N<<1)+newBit)&255;
                PThis.FLAGS.CLEARall();
                newCarry==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
                if (newN==0) PThis.FLAGS.SETx('z');
                PThis.Memory.writeByte(address, newN);
                PThis.Registers.m=4;
            },
			RRCn:function(n){ //CB08 CB09 CB0A CB0B CB0C CB0D CB0F 
				var N = PThis.Registers.EightBit[n];
				var carryBit = (N&0x01)?1:0;
				var newN = ((N>>1)+carryBit*0x80)&255;
				PThis.FLAGS.CLEARall();
				carryBit==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
				if (newN==0) PThis.FLAGS.SETx('z');
				PThis.Registers.EightBit[n] = newN;
				PThis.Registers.m=2;
			},
			RRCatHL: function(){ //CB0E
				var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
				var N = PThis.Memory.readByte(address);
				var carryBit = (N&0x01)?1:0;
				var newN = ((N>>1)+carryBit*0x80)&255;
				PThis.FLAGS.CLEARall();
				carryBit==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
				if (newN==0) PThis.FLAGS.SETx('z');
				PThis.Memory.writeByte(address, newN);
				PThis.Registers.m=4;
			},
			RRn:function(n){ //CB18 CB19 CB1A CB1B CB1C CB1D CB1F  
				var N = PThis.Registers.EightBit[n];
				var newCarry = (N&0x01)?1:0;
				var newBit = (PThis.Registers.EightBit.f&0x10)?1:0;
				var newN = ((N>>1)+newBit*0x80)&255;
				PThis.FLAGS.CLEARall();
				newCarry==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
				if (newN==0) PThis.FLAGS.SETx('z');
				PThis.Registers.EightBit[n] = newN;
				PThis.Registers.m=1;
			},
            RRatHL:function(){ //CB1E
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                var newCarry = (N&0x01)?1:0;
                var newBit = (PThis.Registers.EightBit.f&0x10)?1:0;
                var newN = ((N>>1)+newBit*0x80)&255;
                PThis.FLAGS.CLEARall();
                newCarry==1?PThis.FLAGS.SETx('c'):PThis.FLAGS.CLEARx('c');
                if (newN==0) PThis.FLAGS.SETx('z');
                PThis.Memory.writeByte(address, newN);
                PThis.Registers.m=4;
            }
		},
        SHIFT: {
            SLAn:function(n){ //CB20 CB21 CB22 CB23 CB24 CB25 CB27
                PThis.FLAGS.CLEARall();
                if(PThis.Registers.EightBit[n]&0x80) PThis.FLAGS.SETx('c');
                PThis.Registers.EightBit[n]=(PThis.Registers.EightBit[n]<<1)&255;
                if(PThis.Registers.EightBit[n]==0) PThis.FLAGS.SETx('z');
                PThis.Registers.m=2;
            },
            SLAatHL:function(){ //CB26
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                PThis.FLAGS.CLEARall();
                if(N&0x80) PThis.FLAGS.SETx('c');
                N=(N<<1)&255;
                if(N==0) PThis.FLAGS.SETx('z');
                PThis.Memory.writeByte(address, N);
                PThis.Registers.m=4;
            },
            SRAn: function(n){ //CB28 CB29 CB2A CB2B CB2C CB2D CB2F
                PThis.FLAGS.CLEARall();
                if(PThis.Registers.EightBit[n]&0x01) PThis.FLAGS.SETx('c');
                var add = PThis.Registers.EightBit[n]&0x80;
                PThis.Registers.EightBit[n]=((PThis.Registers.EightBit[n]>>1)+add)&255;
                if(PThis.Registers.EightBit[n] == 0) PThis.FLAGS.SETx('z');
                PThis.Registers.m=2;
            },
            SRAatHL: function(){ //CB2E
                PThis.FLAGS.CLEARall();
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                if(N&0x01) PThis.FLAGS.SETx('c');
                var add = N&0x80;
                N=((N>>1)+add)&255;
                if(N == 0) PThis.FLAGS.SETx('z');
                PThis.Memory.writeByte(address, N);
                PThis.Registers.m=4;
            },
            SRLn: function(n){ //CB38 CB39 CB3A CB3B CB3C CB3D CB3F
                PThis.FLAGS.CLEARall();
                if(PThis.Registers.EightBit[n]&0x01) PThis.FLAGS.SETx('c');
                PThis.Registers.EightBit[n]=((PThis.Registers.EightBit[n]>>1))&0x7F;
                if(PThis.Registers.EightBit[n] == 0) PThis.FLAGS.SETx('z');
                PThis.Registers.m=2;
            },
            SRLatHL: function(){ //CB3E
                PThis.FLAGS.CLEARall();
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);

                if(N&0x01) PThis.FLAGS.SETx('c');
                N=((N >> 1))&0x7F;
                if(N == 0) PThis.FLAGS.SETx('z');
                PThis.Memory.writeByte(address, N);

                PThis.Registers.m=4;
            }

        },
        SWAP: {
            SWAPn: function (n){ //CB30 CB31 CB32 CB33 CB34 CB35 CB37
                PThis.FLAGS.CLEARall();
                var lower = (PThis.Registers.EightBit[n] << 4) & 0xF0;
                var upper = (PThis.Registers.EightBit[n] >>> 4);
                PThis.Registers.EightBit[n] = lower+upper;
                if(PThis.Registers.EightBit[n] == 0) PThis.FLAGS.SETx('z');
                PThis.Registers.m=2;
            },
            SWAPatHL: function(){ //CB36
                PThis.FLAGS.CLEARall();
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                var lower = (N << 4) & 0xF0;
                var upper = (N >>> 4);
                N = lower+upper;
                PThis.Memory.writeByte(address, N);
                if(N == 0) PThis.FLAGS.SETx('z');
                PThis.Registers.m=4;
            }
        },
        BIT: {
            //CB40 CB41 CB42 CB43 CB44 CB45 CB47 CB48 CB49 CB4A CB4B CB4C CB4D CB4F
            //CB50 CB51 CB52 CB53 CB54 CB55 CB57 CB58 CB59 CB5A CB5B CB5C CB5D CB5F
            //CB60 CB61 CB62 CB63 CB64 CB65 CB67 CB68 CB69 CB6A CB6B CB6C CB6D CB6F
            //CB70 CB71 CB72 CB73 CB74 CB75 CB77 CB78 CB79 CB7A CB7B CB7C CB7D CB7F
            BITn: function (n,bit){
                var test = PThis.bitToTestCase(bit);
                (PThis.Registers.EightBit[n]&test)?PThis.FLAGS.CLEARx('z'):PThis.FLAGS.SETx('z');
                PThis.FLAGS.CLEARx('n');
                PThis.FLAGS.SETx('h');
                PThis.Registers.m=2;

            },
            BITatHL: function (bit){ //CB46 CB4E CB56 CB5E CB66 CB6E CB76 CB7E
                var test = PThis.bitToTestCase(bit);
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                (N&test)?PThis.FLAGS.CLEARx('z'):PThis.FLAGS.SETx('z');
                PThis.FLAGS.CLEARx('n');
                PThis.FLAGS.SETx('h');
                PThis.Registers.m=4;
            }
        },
        RES: {
            RESn: function (n,bit) {
                //CB80 CB81 CB82 CB83 CB84 CB85 CB87 CB88 CB89 CB8A CB8B CB8C CB8D CB8F
                //CB90 CB91 CB92 CB93 CB94 CB95 CB97 CB98 CB99 CB9A CB9B CB9C CB9D CB9F
                //CBA0 CBA1 CBA2 CBA3 CBA4 CBA5 CBA7 CBA8 CBA9 CBAA CBAB CBAC CBAD CBAF
                //CBB0 CBB1 CBB2 CBB3 CBB4 CBB5 CBB7 CBB8 CBB9 CBBA CBBB CBBC CBBD CBBF
                var res = PThis.bitToResCase(bit);
                PThis.Registers.EightBit[n]&=res;
                PThis.Registers.m=2;
            },
            RESatHL: function (bit) {  //CB86 CB8E CB96 CB9E CBA6 CBAE CBB6 CBBE
                var res = PThis.bitToResCase(bit);
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                N&=res;
                PThis.Memory.writeByte(address, N);
                PThis.Registers.m=4;
            }
        },
        SET: {
            SETn: function (n,bit) {
                //CBC0 CBC1 CBC2 CBC3 CBC4 CBC5 CBC7 CBC8 CBC9 CBCA CBCB CBCC CBCD CBCF
                //CBD0 CBD1 CBD2 CBD3 CBD4 CBD5 CBD7 CBD8 CBD9 CBDA CBDB CBDC CBDD CBDF
                //CBE0 CBE1 CBE2 CBE3 CBE4 CBE5 CBE7 CBE8 CBE9 CBEA CBEB CBEC CBED CBEF
                //CBF0 CBF1 CBF2 CBF3 CBF4 CBF5 CBF7 CBF8 CBF9 CBFA CBFB CBFC CBFD CBFF
                var res = PThis.bitToTestCase(bit);
                PThis.Registers.EightBit[n]|=res;
                PThis.Registers.m=2;
            },
            SETatHL: function (bit) {  //CBC6 CBCE CBD6 CBDE CBE6 CBEE CBF6 CBFE
                var res = PThis.bitToTestCase(bit);
                var address = (PThis.Registers.EightBit.h<<8)+PThis.Registers.EightBit.l;
                var N = PThis.Memory.readByte(address);
                N|=res;
                PThis.Memory.writeByte(address, N);
                PThis.Registers.m=4;
            }
        }
	};
	
    this.FLAGS={
        CLEARall: function(){
            PThis.Registers.EightBit.f=0;
        },
        CLEARx: function(x){ //use with znhc string
            switch(x){
                case 'z':
                    PThis.Registers.EightBit.f&=0x7F; return;//mask 8th bit to 0
                case 'n':
                    PThis.Registers.EightBit.f&=0xBF; return;//mask 7th bit to 0
                case 'h':
                    PThis.Registers.EightBit.f&=0xDF; return;
                case 'c':
                    PThis.Registers.EightBit.f&=0xEF;
            }
        },
        SETx: function(x){ //use with znhc string
            switch(x){
                case 'z':
                    PThis.Registers.EightBit.f|=0x80; return;//mask 8th bit to 1
                case 'n':
                    PThis.Registers.EightBit.f|=0x40; return;//mask 7th bit to 1
                case 'h':
                    PThis.Registers.EightBit.f|=0x20; return;
                case 'c':
                    PThis.Registers.EightBit.f|=0x10;
            }
        }

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
    };
    this.bitToTestCase= function(bit) {
        switch (bit) {
            case 0:
                return 0x01;
            case 1:
                return 0x02;
            case 2:
                return 0x04;
            case 3:
                return 0x08;
            case 4:
                return 0x10;
            case 5:
                return 0x20;
            case 6:
                return 0x40;
            case 7:
                return 0x80;
        }
    }
    this.bitToResCase= function(bit) {
        switch (bit) {
            case 0:
                return 0xFE;
            case 1:
                return 0xFD;
            case 2:
                return 0xFB;
            case 3:
                return 0xF7;
            case 4:
                return 0xEF;
            case 5:
                return 0xDF;
            case 6:
                return 0xBF;
            case 7:
                return 0x7F;
        }
    }

    this.map = function(opcode) {
        switch (opcode) {
            case 0x00: return PThis.MISC.NOP();
            case 0x01: return PThis.LOAD.LOAD16IM('b', 'c');
            case 0x02: return PThis.LOAD.LOADaAT16('b','c');
            case 0x03: return PThis.INC.INC16('b','c');
            case 0x04: return PThis.INC.INC8('b');
            case 0x05: return PThis.DEC.DEC8('b');
            case 0x06: return PThis.LOAD.LOAD8IM('b');
            case 0x07: return PThis.ROTATE.RLCA();
            case 0x08: return PThis.LOAD.LOADspA16();
            case 0x09: return PThis.ADD.ADD16toHL('b','c');
            case 0x0A: return PThis.LOAD.LOADfrom16RtoA('b','c');
            case 0x0B: return PThis.DEC.DEC16('b','c');
            case 0x0C: return PThis.INC.INC8('c');
            case 0x0D: return PThis.DEC.DEC8('c');
            case 0x0E: return PThis.LOAD.LOAD8IM('c');
            case 0x0F: return PThis.ROTATE.RRCA();

            case 0x10: return PThis.MISC.STOP();
            case 0x11: return PThis.LOAD.LOAD16IM('d','e');
            case 0x12: return PThis.LOAD.LOADaAT16('d','e');
            case 0x13: return PThis.INC.INC16('d','e');
            case 0x14: return PThis.INC.INC8('d');
            case 0x15: return PThis.DEC.DEC8('d');
            case 0x16: return PThis.LOAD.LOAD8IM('d');
            case 0x17: return PThis.ROTATE.RLA();
            case 0x18: return PThis.JUMP.JUMPr8();
            case 0x19: return PThis.ADD.ADD16toHL('d','e');
            case 0x1A: return PThis.LOAD.LOADfrom16RtoA('d','e');
            case 0x1B: return PThis.DEC.DEC16('d','e');
            case 0x1C: return PThis.INC.INC8('e');
            case 0x1D: return PThis.DEC.DEC8('e');
            case 0x1E: return PThis.LOAD.LOAD8IM('e');
            case 0x1F: return PThis.ROTATE.RRA();

            case 0x20: return PThis.JUMP.JUMPrIFcc('nz');
            case 0x21: return PThis.LOAD.LOAD16IM('h','l');
            case 0x22: return PThis.LOAD.LOADaAThlTHEN(true);
            case 0x23: return PThis.INC.INC16('h','l');
            case 0x24: return PThis.INC.INC8('h');
            case 0x25: return PThis.DEC.DEC8('h');
            case 0x26: return PThis.LOAD.LOAD8IM('h');
            case 0x27: return PThis.MISC.DAA();
            case 0x28: return PThis.JUMP.JUMPrIFcc('z');
            case 0x29: return PThis.ADD.ADD16toHL('h','l');
            case 0x2A: return PThis.LOAD.LOADhlINTOaTHEN(true);
            case 0x2B: return PThis.DEC.DEC16('h','l');
            case 0x2C: return PThis.INC.INC8('l');
            case 0x2D: return PThis.DEC.DEC8('l');
            case 0x2E: return PThis.LOAD.LOAD8IM('e');
            case 0x2F: return PThis.MISC.CPL();

            case 0x30: return PThis.JUMP.JUMPrIFcc('nc');
            case 0x31: return PThis.LOAD.LOAD16IMSP();
            case 0x32: return PThis.LOAD.LOADaAThlTHEN(false);
            case 0x33: return PThis.INC.INCSP();
            case 0x34: return PThis.INC.INCatHL();
            case 0x35: return PThis.DEC.DECatHL();
            case 0x36: return PThis.LOAD.LOAD8IMatHL();
            case 0x37: return PThis.MISC.SCF();
            case 0x38: return PThis.JUMP.JUMPrIFcc('c');
            case 0x39: return PThis.ADD.ADDSPtoHL();
            case 0x3A: return PThis.LOAD.LOADhlINTOaTHEN(false);
            case 0x3B: return PThis.DEC.DECsp();
            case 0x3C: return PThis.INC.INC8('a');
            case 0x3D: return PThis.DEC.DEC8('a');
            case 0x3E: return PThis.LOAD.LOAD8IM('a');
            case 0x3F: return PThis.MISC.CCF();

            case 0x40: return PThis.LOAD.LOAD8RtoR('b','b');
            case 0x41: return PThis.LOAD.LOAD8RtoR('b','c');
            case 0x42: return PThis.LOAD.LOAD8RtoR('b','d');
            case 0x43: return PThis.LOAD.LOAD8RtoR('b','e');
            case 0x44: return PThis.LOAD.LOAD8RtoR('b','h');
            case 0x45: return PThis.LOAD.LOAD8RtoR('b','l');
            case 0x46: return PThis.LOAD.LOAD8FROMaddressAThl('b');
            case 0x47: return PThis.LOAD.LOAD8RtoR('b','a');
            case 0x48: return PThis.LOAD.LOAD8RtoR('c','b');
            case 0x49: return PThis.LOAD.LOAD8RtoR('c','c');
            case 0x4A: return PThis.LOAD.LOAD8RtoR('c','d');
            case 0x4B: return PThis.LOAD.LOAD8RtoR('c','e');
            case 0x4C: return PThis.LOAD.LOAD8RtoR('c','h');
            case 0x4D: return PThis.LOAD.LOAD8RtoR('c','l');
            case 0x4E: return PThis.LOAD.LOAD8FROMaddressAThl('c');
            case 0x4F: return PThis.LOAD.LOAD8RtoR('c','a');

            case 0x50: return PThis.LOAD.LOAD8RtoR('d','b');
            case 0x51: return PThis.LOAD.LOAD8RtoR('d','c');
            case 0x52: return PThis.LOAD.LOAD8RtoR('d','d');
            case 0x53: return PThis.LOAD.LOAD8RtoR('d','e');
            case 0x54: return PThis.LOAD.LOAD8RtoR('d','h');
            case 0x55: return PThis.LOAD.LOAD8RtoR('d','l');
            case 0x56: return PThis.LOAD.LOAD8FROMaddressAThl('d');
            case 0x57: return PThis.LOAD.LOAD8RtoR('d','a');
            case 0x58: return PThis.LOAD.LOAD8RtoR('e','b');
            case 0x59: return PThis.LOAD.LOAD8RtoR('e','c');
            case 0x5A: return PThis.LOAD.LOAD8RtoR('e','d');
            case 0x5B: return PThis.LOAD.LOAD8RtoR('e','e');
            case 0x5C: return PThis.LOAD.LOAD8RtoR('e','h');
            case 0x5D: return PThis.LOAD.LOAD8RtoR('e','l');
            case 0x5E: return PThis.LOAD.LOAD8FROMaddressAThl('e');
            case 0x5F: return PThis.LOAD.LOAD8RtoR('e','a');

            case 0x60: return PThis.LOAD.LOAD8RtoR('h','b');
            case 0x61: return PThis.LOAD.LOAD8RtoR('h','c');
            case 0x62: return PThis.LOAD.LOAD8RtoR('h','d');
            case 0x63: return PThis.LOAD.LOAD8RtoR('h','e');
            case 0x64: return PThis.LOAD.LOAD8RtoR('h','h');
            case 0x65: return PThis.LOAD.LOAD8RtoR('h','l');
            case 0x66: return PThis.LOAD.LOAD8FROMaddressAThl('h');
            case 0x67: return PThis.LOAD.LOAD8RtoR('h','a');
            case 0x68: return PThis.LOAD.LOAD8RtoR('l','b');
            case 0x69: return PThis.LOAD.LOAD8RtoR('l','c');
            case 0x6A: return PThis.LOAD.LOAD8RtoR('l','d');
            case 0x6B: return PThis.LOAD.LOAD8RtoR('l','e');
            case 0x6C: return PThis.LOAD.LOAD8RtoR('l','h');
            case 0x6D: return PThis.LOAD.LOAD8RtoR('l','l');
            case 0x6E: return PThis.LOAD.LOAD8FROMaddressAThl('l');
            case 0x6F: return PThis.LOAD.LOAD8RtoR('l','a');

            case 0x70: return PThis.LOAD.LOADrATaddressHL('b');
            case 0x71: return PThis.LOAD.LOADrATaddressHL('c');
            case 0x72: return PThis.LOAD.LOADrATaddressHL('d');
            case 0x73: return PThis.LOAD.LOADrATaddressHL('e');
            case 0x74: return PThis.LOAD.LOADrATaddressHL('h');
            case 0x75: return PThis.LOAD.LOADrATaddressHL('l');
            case 0x76: return PThis.HALT=1;
            case 0x77: return PThis.LOAD.LOADaAT16('a','l');
            case 0x78: return PThis.LOAD.LOAD8RtoR('a','b');
            case 0x79: return PThis.LOAD.LOAD8RtoR('a','c');
            case 0x7A: return PThis.LOAD.LOAD8RtoR('a','d');
            case 0x7B: return PThis.LOAD.LOAD8RtoR('a','e');
            case 0x7C: return PThis.LOAD.LOAD8RtoR('a','h');
            case 0x7D: return PThis.LOAD.LOAD8RtoR('a','l');
            case 0x7E: return PThis.LOAD.LOADfrom16RtoA('h','l');
            case 0x7F: return PThis.LOAD.LOAD8RtoR('a','a');

            case 0x80: return PThis.ADD.ADD8('b');
            case 0x81: return PThis.ADD.ADD8('c');
            case 0x82: return PThis.ADD.ADD8('d');
            case 0x83: return PThis.ADD.ADD8('e');
            case 0x84: return PThis.ADD.ADD8('h');
            case 0x85: return PThis.ADD.ADD8('l');
            case 0x86: return PThis.ADD.ADDatHLtoA();
            case 0x87: return PThis.ADD.ADD8('a');
            case 0x88: return PThis.ADD.ADD8C('b');
            case 0x89: return PThis.ADD.ADD8C('c');
            case 0x8A: return PThis.ADD.ADD8C('d');
            case 0x8B: return PThis.ADD.ADD8C('e');
            case 0x8C: return PThis.ADD.ADD8C('h');
            case 0x8D: return PThis.ADD.ADD8C('l');
            case 0x8E: return PThis.ADD.ADDatHLtoAC();
            case 0x8F: return PThis.ADD.ADD8C('a');

            case 0x90: return PThis.SUB.SUB8('b');
            case 0x91: return PThis.SUB.SUB8('c');
            case 0x92: return PThis.SUB.SUB8('d');
            case 0x93: return PThis.SUB.SUB8('e');
            case 0x94: return PThis.SUB.SUB8('h');
            case 0x95: return PThis.SUB.SUB8('l');
            case 0x96: return PThis.SUB.SUBatHLtoA();
            case 0x97: return PThis.SUB.SUB8('a');
            case 0x98: return PThis.SUB.SUB8C('b');
            case 0x99: return PThis.SUB.SUB8C('c');
            case 0x9A: return PThis.SUB.SUB8C('d');
            case 0x9B: return PThis.SUB.SUB8C('e');
            case 0x9C: return PThis.SUB.SUB8C('h');
            case 0x9D: return PThis.SUB.SUB8C('l');
            case 0x9E: return PThis.SUB.SUBatHLtoAC();
            case 0x9F: return PThis.SUB.SUB8C('a');

            case 0xA0: return PThis.AND.ANDN('b');
            case 0xA1: return PThis.AND.ANDN('c');
            case 0xA2: return PThis.AND.ANDN('d');
            case 0xA3: return PThis.AND.ANDN('e');
            case 0xA4: return PThis.AND.ANDN('h');
            case 0xA5: return PThis.AND.ANDN('l');
            case 0xA6: return PThis.AND.ANDHL();
            case 0xA7: return PThis.AND.ANDN('a');
            case 0xA8: return PThis.XOR.XORN('b');
            case 0xA9: return PThis.XOR.XORN('c');
            case 0xAA: return PThis.XOR.XORN('d');
            case 0xAB: return PThis.XOR.XORN('e');
            case 0xAC: return PThis.XOR.XORN('h');
            case 0xAD: return PThis.XOR.XORN('l');
            case 0xAE: return PThis.XOR.XORHL();
            case 0xAF: return PThis.XOR.XORN('a');

            case 0xB0: return PThis.OR.ORN('b');
            case 0xB1: return PThis.OR.ORN('c');
            case 0xB2: return PThis.OR.ORN('d');
            case 0xB3: return PThis.OR.ORN('e');
            case 0xB4: return PThis.OR.ORN('h');
            case 0xB5: return PThis.OR.ORN('l');
            case 0xB6: return PThis.OR.ORHL();
            case 0xB7: return PThis.OR.ORN('a');
            case 0xB8: return PThis.CP.CPN('b');
            case 0xB9: return PThis.CP.CPN('c');
            case 0xBA: return PThis.CP.CPN('d');
            case 0xBB: return PThis.CP.CPN('e');
            case 0xBC: return PThis.CP.CPN('h');
            case 0xBD: return PThis.CP.CPN('l');
            case 0xBE: return PThis.CP.CPHL();
            case 0xBF: return PThis.CP.CPN('a');

            case 0xC0: return PThis.JUMP.RETifCC('nz');
            case 0xC1: return PThis.STACK.POP('b','c');
            case 0xC2: return PThis.JUMP.JUMPa16if('nz');
            case 0xC3: return PThis.JUMP.JUMPa16();
            case 0xC4: return PThis.MISC.CALLif('nz');
            case 0xC5: return PThis.STACK.PUSH('b','c');
            case 0xC6: return PThis.ADD.ADDd8();
            case 0xC7: return PThis.RESET.RST(0x00);
            case 0xC8: return PThis.JUMP.RETifCC('z');
            case 0xC9: return PThis.JUMP.RET();
            case 0xCA: return PThis.JUMP.JUMPa16if('z');
            case 0xCB: return PThis.CB();
            case 0xCC: return PThis.MISC.CALLif('z');
            case 0xCD: return PThis.MISC.CALL();
            case 0xCE: return PThis.ADD.ADDd8C();
            case 0xCF: return PThis.RESET.RST(0x08);

            case 0xD0: return PThis.JUMP.RETifCC('nc');
            case 0xD1: return PThis.STACK.POP('d','e');
            case 0xD2: return PThis.JUMP.JUMPa16if('nc');
            case 0xD3: return PThis.MISC.CALLif('nc');
            case 0xD4: return console.log('no command');
            case 0xD5: return PThis.STACK.PUSH('d','e');
            case 0xD6: return PThis.SUB.SUBd8();
            case 0xD7: return PThis.RESET.RST(0x10);
            case 0xD8: return PThis.JUMP.RETifCC('c');
            case 0xD9: return PThis.JUMP.RETI();
            case 0xDA: return PThis.JUMP.JUMPa16if('c');
            case 0xDB: return console.log('no command');
            case 0xDC: return PThis.MISC.CALLif('c');
            case 0xDD: return console.log('no command');
            case 0xDE: return PThis.SUB.SUBd8C();
            case 0xDF: return PThis.RESET.RST(0x18);

            case 0xE0: return PThis.LOAD.LDHto();
            case 0xE1: return PThis.STACK.POP('h','l');
            case 0xE2: return PThis.LOAD.LDCto();
            case 0xE3: return console.log('no command');
            case 0xE4: return console.log('no command');
            case 0xE5: return PThis.STACK.PUSH('h','l');
            case 0xE6: return PThis.AND.ANDd8();
            case 0xE7: return PThis.RESET.RST(0x20);
            case 0xE8: return PThis.ADD.ADDspn();
            case 0xE9: return PThis.JUMP.JUMPhl();
            case 0xEA: return PThis.LOAD.LOADaATimm();
            case 0xEB: return console.log('no command');
            case 0xEC: return console.log('no command');
            case 0xED: return console.log('no command');
            case 0xEE: return PThis.XOR.XORd8();
            case 0xEF: return PThis.RESET.RST(0x28);

            case 0xF0: return PThis.LOAD.LDHfrom();
            case 0xF1: return PThis.STACK.POP('a','f');
            case 0xF2: return PThis.LOAD.LDCfrom();
            case 0xF3:
            case 0xF4: return console.log('no command');
            case 0xF5: return PThis.STACK.PUSH('a','f');
            case 0xF6: return PThis.OR.ORd8();
            case 0xF7: return PThis.RESET.RST(0x30);
            case 0xF8: return PThis.LOAD.LOADtoHLspPLUSn();
            case 0xF9: return PThis.LOAD.LOADtoSPhl();
            case 0xFA: return PThis.LOAD.LOADimmTOa();
            case 0xFB:
            case 0xFC: return console.log('no command');
            case 0xFD: return console.log('no command');
            case 0xFE: return PThis.CP.CPd8();
            case 0xFF: return PThis.RESET.RST(0x38);

        }
    }

    this.CBmap = function(opcode){
        switch(opcode){
            case 0x00: return PThis.CBtable.ROTATE.RLCn('b');
            case 0x01: return PThis.CBtable.ROTATE.RLCn('c');
            case 0x02: return PThis.CBtable.ROTATE.RLCn('d');
            case 0x03: return PThis.CBtable.ROTATE.RLCn('e');
            case 0x04: return PThis.CBtable.ROTATE.RLCn('h');
            case 0x05: return PThis.CBtable.ROTATE.RLCn('l');
            case 0x06: return PThis.CBtable.ROTATE.RLCatHL();
            case 0x07: return PThis.CBtable.ROTATE.RLCn('a');
            case 0x08: return PThis.CBtable.ROTATE.RRCn('b');
            case 0x09: return PThis.CBtable.ROTATE.RRCn('c');
            case 0x0A: return PThis.CBtable.ROTATE.RRCn('d');
            case 0x0B: return PThis.CBtable.ROTATE.RRCn('e');
            case 0x0C: return PThis.CBtable.ROTATE.RRCn('h');
            case 0x0D: return PThis.CBtable.ROTATE.RRCn('l');
            case 0x0E: return PThis.CBtable.ROTATE.RRCatHL();
            case 0x0F: return PThis.CBtable.ROTATE.RRCn('a');

            case 0x10: return PThis.CBtable.ROTATE.RLn('b');
            case 0x11: return PThis.CBtable.ROTATE.RLn('c');
            case 0x12: return PThis.CBtable.ROTATE.RLn('d');
            case 0x13: return PThis.CBtable.ROTATE.RLn('e');
            case 0x14: return PThis.CBtable.ROTATE.RLn('h');
            case 0x15: return PThis.CBtable.ROTATE.RLn('l');
            case 0x16: return PThis.CBtable.ROTATE.RLatHL();
            case 0x17: return PThis.CBtable.ROTATE.RLn('b');
            case 0x18: return PThis.CBtable.ROTATE.RRn('b');
            case 0x19: return PThis.CBtable.ROTATE.RRn('c');
            case 0x1A: return PThis.CBtable.ROTATE.RRn('d');
            case 0x1B: return PThis.CBtable.ROTATE.RRn('e');
            case 0x1C: return PThis.CBtable.ROTATE.RRn('h');
            case 0x1D: return PThis.CBtable.ROTATE.RRn('l');
            case 0x1E: return PThis.CBtable.ROTATE.RRatHL();
            case 0x1F: return PThis.CBtable.ROTATE.RRn('a');

            case 0x20: return PThis.CBtable.SHIFT.SLAn('b');
            case 0x21: return PThis.CBtable.SHIFT.SLAn('c');
            case 0x22: return PThis.CBtable.SHIFT.SLAn('d');
            case 0x23: return PThis.CBtable.SHIFT.SLAn('e');
            case 0x24: return PThis.CBtable.SHIFT.SLAn('h');
            case 0x25: return PThis.CBtable.SHIFT.SLAn('l');
            case 0x26: return PThis.CBtable.SHIFT.SLAatHL();
            case 0x27: return PThis.CBtable.SHIFT.SLAn('a');
            case 0x28: return PThis.CBtable.SHIFT.SRAn('b');
            case 0x29: return PThis.CBtable.SHIFT.SRAn('c');
            case 0x2A: return PThis.CBtable.SHIFT.SRAn('d');
            case 0x2B: return PThis.CBtable.SHIFT.SRAn('e');
            case 0x2C: return PThis.CBtable.SHIFT.SRAn('h');
            case 0x2D: return PThis.CBtable.SHIFT.SRAn('l');
            case 0x2E: return PThis.CBtable.SHIFT.SRAatHL();
            case 0x2F: return PThis.CBtable.SHIFT.SRAn('a');

            case 0x30: return PThis.CBtable.SWAP.SWAPn('b');
            case 0x31: return PThis.CBtable.SWAP.SWAPn('c');
            case 0x32: return PThis.CBtable.SWAP.SWAPn('d');
            case 0x33: return PThis.CBtable.SWAP.SWAPn('e');
            case 0x34: return PThis.CBtable.SWAP.SWAPn('h');
            case 0x35: return PThis.CBtable.SWAP.SWAPn('l');
            case 0x36: return PThis.CBtable.SWAP.SWAPatHL();
            case 0x37: return PThis.CBtable.SWAP.SWAPn('a');
            case 0x38: return PThis.CBtable.SHIFT.SRLn('b');
            case 0x39: return PThis.CBtable.SHIFT.SRLn('c');
            case 0x3A: return PThis.CBtable.SHIFT.SRLn('d');
            case 0x3B: return PThis.CBtable.SHIFT.SRLn('e');
            case 0x3C: return PThis.CBtable.SHIFT.SRLn('h');
            case 0x3D: return PThis.CBtable.SHIFT.SRLn('l');
            case 0x3E: return PThis.CBtable.SHIFT.SRLatHL();
            case 0x3F: return PThis.CBtable.SHIFT.SRLn('a');

            case 0x40: return PThis.CBtable.BIT.BITn('b',0);
            case 0x41: return PThis.CBtable.BIT.BITn('c',0);
            case 0x42: return PThis.CBtable.BIT.BITn('d',0);
            case 0x43: return PThis.CBtable.BIT.BITn('e',0);
            case 0x44: return PThis.CBtable.BIT.BITn('h',0);
            case 0x45: return PThis.CBtable.BIT.BITn('l',0);
            case 0x46: return PThis.CBtable.BIT.BITatHL(0);
            case 0x47: return PThis.CBtable.BIT.BITn('a',0);
            case 0x48: return PThis.CBtable.BIT.BITn('b',1);
            case 0x49: return PThis.CBtable.BIT.BITn('c',1);
            case 0x4A: return PThis.CBtable.BIT.BITn('d',1);
            case 0x4B: return PThis.CBtable.BIT.BITn('e',1);
            case 0x4C: return PThis.CBtable.BIT.BITn('h',1);
            case 0x4D: return PThis.CBtable.BIT.BITn('l',1);
            case 0x4E: return PThis.CBtable.BIT.BITatHL(1);
            case 0x4F: return PThis.CBtable.BIT.BITn('a',1);

            case 0x50: return PThis.CBtable.BIT.BITn('b',2);
            case 0x51: return PThis.CBtable.BIT.BITn('c',2);
            case 0x52: return PThis.CBtable.BIT.BITn('d',2);
            case 0x53: return PThis.CBtable.BIT.BITn('e',2);
            case 0x54: return PThis.CBtable.BIT.BITn('h',2);
            case 0x55: return PThis.CBtable.BIT.BITn('l',2);
            case 0x56: return PThis.CBtable.BIT.BITatHL(2);
            case 0x57: return PThis.CBtable.BIT.BITn('a',2);
            case 0x58: return PThis.CBtable.BIT.BITn('b',3);
            case 0x59: return PThis.CBtable.BIT.BITn('c',3);
            case 0x5A: return PThis.CBtable.BIT.BITn('d',3);
            case 0x5B: return PThis.CBtable.BIT.BITn('e',3);
            case 0x5C: return PThis.CBtable.BIT.BITn('h',3);
            case 0x5D: return PThis.CBtable.BIT.BITn('l',3);
            case 0x5E: return PThis.CBtable.BIT.BITatHL(3);
            case 0x5F: return PThis.CBtable.BIT.BITn('a',3);

            case 0x60: return PThis.CBtable.BIT.BITn('b',4);
            case 0x61: return PThis.CBtable.BIT.BITn('c',4);
            case 0x62: return PThis.CBtable.BIT.BITn('d',4);
            case 0x63: return PThis.CBtable.BIT.BITn('e',4);
            case 0x64: return PThis.CBtable.BIT.BITn('h',4);
            case 0x65: return PThis.CBtable.BIT.BITn('l',4);
            case 0x66: return PThis.CBtable.BIT.BITatHL(4);
            case 0x67: return PThis.CBtable.BIT.BITn('a',4);
            case 0x68: return PThis.CBtable.BIT.BITn('b',5);
            case 0x69: return PThis.CBtable.BIT.BITn('c',5);
            case 0x6A: return PThis.CBtable.BIT.BITn('d',5);
            case 0x6B: return PThis.CBtable.BIT.BITn('e',5);
            case 0x6C: return PThis.CBtable.BIT.BITn('h',5);
            case 0x6D: return PThis.CBtable.BIT.BITn('l',5);
            case 0x6E: return PThis.CBtable.BIT.BITatHL(5);
            case 0x6F: return PThis.CBtable.BIT.BITn('a',5);

            case 0x70: return PThis.CBtable.BIT.BITn('b',6);
            case 0x71: return PThis.CBtable.BIT.BITn('c',6);
            case 0x72: return PThis.CBtable.BIT.BITn('d',6);
            case 0x73: return PThis.CBtable.BIT.BITn('e',6);
            case 0x74: return PThis.CBtable.BIT.BITn('h',6);
            case 0x75: return PThis.CBtable.BIT.BITn('l',6);
            case 0x76: return PThis.CBtable.BIT.BITatHL(6);
            case 0x77: return PThis.CBtable.BIT.BITn('a',6);
            case 0x78: return PThis.CBtable.BIT.BITn('b',7);
            case 0x79: return PThis.CBtable.BIT.BITn('c',7);
            case 0x7A: return PThis.CBtable.BIT.BITn('d',7);
            case 0x7B: return PThis.CBtable.BIT.BITn('e',7);
            case 0x7C: return PThis.CBtable.BIT.BITn('h',7);
            case 0x7D: return PThis.CBtable.BIT.BITn('l',7);
            case 0x7E: return PThis.CBtable.BIT.BITatHL(7);
            case 0x7F: return PThis.CBtable.BIT.BITn('a',7);
            
            case 0x80: return PThis.CBtable.BIT.BITn('b',0);
            case 0x81: return PThis.CBtable.BIT.BITn('c',0);
            case 0x82: return PThis.CBtable.BIT.BITn('d',0);
            case 0x83: return PThis.CBtable.BIT.BITn('e',0);
            case 0x84: return PThis.CBtable.BIT.BITn('h',0);
            case 0x85: return PThis.CBtable.BIT.BITn('l',0);
            case 0x86: return PThis.CBtable.BIT.BITatHL(0);
            case 0x87: return PThis.CBtable.BIT.BITn('a',0);
            case 0x88: return PThis.CBtable.BIT.BITn('b',1);
            case 0x89: return PThis.CBtable.BIT.BITn('c',1);
            case 0x8A: return PThis.CBtable.BIT.BITn('d',1);
            case 0x8B: return PThis.CBtable.BIT.BITn('e',1);
            case 0x8C: return PThis.CBtable.BIT.BITn('h',1);
            case 0x8D: return PThis.CBtable.BIT.BITn('l',1);
            case 0x8E: return PThis.CBtable.BIT.BITatHL(1);
            case 0x8F: return PThis.CBtable.BIT.BITn('a',1);

            case 0x90: return PThis.CBtable.RES.RESn('b',2);
            case 0x91: return PThis.CBtable.RES.RESn('c',2);
            case 0x92: return PThis.CBtable.RES.RESn('d',2);
            case 0x93: return PThis.CBtable.RES.RESn('e',2);
            case 0x94: return PThis.CBtable.RES.RESn('h',2);
            case 0x95: return PThis.CBtable.RES.RESn('l',2);
            case 0x96: return PThis.CBtable.RES.RESatHL(2);
            case 0x97: return PThis.CBtable.RES.RESn('a',2);
            case 0x98: return PThis.CBtable.RES.RESn('b',3);
            case 0x99: return PThis.CBtable.RES.RESn('c',3);
            case 0x9A: return PThis.CBtable.RES.RESn('d',3);
            case 0x9B: return PThis.CBtable.RES.RESn('e',3);
            case 0x9C: return PThis.CBtable.RES.RESn('h',3);
            case 0x9D: return PThis.CBtable.RES.RESn('l',3);
            case 0x9E: return PThis.CBtable.RES.RESatHL(3);
            case 0x9F: return PThis.CBtable.RES.RESn('a',3);

            case 0xA0: return PThis.CBtable.RES.RESn('b',4);
            case 0xA1: return PThis.CBtable.RES.RESn('c',4);
            case 0xA2: return PThis.CBtable.RES.RESn('d',4);
            case 0xA3: return PThis.CBtable.RES.RESn('e',4);
            case 0xA4: return PThis.CBtable.RES.RESn('h',4);
            case 0xA5: return PThis.CBtable.RES.RESn('l',4);
            case 0xA6: return PThis.CBtable.RES.RESatHL(4);
            case 0xA7: return PThis.CBtable.RES.RESn('a',4);
            case 0xA8: return PThis.CBtable.RES.RESn('b',5);
            case 0xA9: return PThis.CBtable.RES.RESn('c',5);
            case 0xAA: return PThis.CBtable.RES.RESn('d',5);
            case 0xAB: return PThis.CBtable.RES.RESn('e',5);
            case 0xAC: return PThis.CBtable.RES.RESn('h',5);
            case 0xAD: return PThis.CBtable.RES.RESn('l',5);
            case 0xAE: return PThis.CBtable.RES.RESatHL(5);
            case 0xAF: return PThis.CBtable.RES.RESn('a',5);

            case 0xB0: return PThis.CBtable.RES.RESn('b',6);
            case 0xB1: return PThis.CBtable.RES.RESn('c',6);
            case 0xB2: return PThis.CBtable.RES.RESn('d',6);
            case 0xB3: return PThis.CBtable.RES.RESn('e',6);
            case 0xB4: return PThis.CBtable.RES.RESn('h',6);
            case 0xB5: return PThis.CBtable.RES.RESn('l',6);
            case 0xB6: return PThis.CBtable.RES.RESatHL(6);
            case 0xB7: return PThis.CBtable.RES.RESn('a',6);
            case 0xB8: return PThis.CBtable.RES.RESn('b',7);
            case 0xB9: return PThis.CBtable.RES.RESn('c',7);
            case 0xBA: return PThis.CBtable.RES.RESn('d',7);
            case 0xBB: return PThis.CBtable.RES.RESn('e',7);
            case 0xBC: return PThis.CBtable.RES.RESn('h',7);
            case 0xBD: return PThis.CBtable.RES.RESn('l',7);
            case 0xBE: return PThis.CBtable.RES.RESatHL(7);
            case 0xBF: return PThis.CBtable.RES.RESn('a',7);

            case 0xC0: return PThis.CBtable.SET.SETn('b',0);
            case 0xC1: return PThis.CBtable.SET.SETn('c',0);
            case 0xC2: return PThis.CBtable.SET.SETn('d',0);
            case 0xC3: return PThis.CBtable.SET.SETn('e',0);
            case 0xC4: return PThis.CBtable.SET.SETn('h',0);
            case 0xC5: return PThis.CBtable.SET.SETn('l',0);
            case 0xC6: return PThis.CBtable.SET.SETatHL(0);
            case 0xC7: return PThis.CBtable.SET.SETn('a',0);
            case 0xC8: return PThis.CBtable.SET.SETn('b',1);
            case 0xC9: return PThis.CBtable.SET.SETn('c',1);
            case 0xCA: return PThis.CBtable.SET.SETn('d',1);
            case 0xCB: return PThis.CBtable.SET.SETn('e',1);
            case 0xCC: return PThis.CBtable.SET.SETn('h',1);
            case 0xCD: return PThis.CBtable.SET.SETn('l',1);
            case 0xCE: return PThis.CBtable.SET.SETatHL(1);
            case 0xCF: return PThis.CBtable.SET.SETn('a',1);

            case 0xD0: return PThis.CBtable.SET.SETn('b',2);
            case 0xD1: return PThis.CBtable.SET.SETn('c',2);
            case 0xD2: return PThis.CBtable.SET.SETn('d',2);
            case 0xD3: return PThis.CBtable.SET.SETn('e',2);
            case 0xD4: return PThis.CBtable.SET.SETn('h',2);
            case 0xD5: return PThis.CBtable.SET.SETn('l',2);
            case 0xD6: return PThis.CBtable.SET.SETatHL(2);
            case 0xD7: return PThis.CBtable.SET.SETn('a',2);
            case 0xD8: return PThis.CBtable.SET.SETn('b',3);
            case 0xD9: return PThis.CBtable.SET.SETn('c',3);
            case 0xDA: return PThis.CBtable.SET.SETn('d',3);
            case 0xDB: return PThis.CBtable.SET.SETn('e',3);
            case 0xDC: return PThis.CBtable.SET.SETn('h',3);
            case 0xDD: return PThis.CBtable.SET.SETn('l',3);
            case 0xDE: return PThis.CBtable.SET.SETatHL(3);
            case 0xDF: return PThis.CBtable.SET.SETn('a',3);

            case 0xE0: return PThis.CBtable.SET.SETn('b',4);
            case 0xE1: return PThis.CBtable.SET.SETn('c',4);
            case 0xE2: return PThis.CBtable.SET.SETn('d',4);
            case 0xE3: return PThis.CBtable.SET.SETn('e',4);
            case 0xE4: return PThis.CBtable.SET.SETn('h',4);
            case 0xE5: return PThis.CBtable.SET.SETn('l',4);
            case 0xE6: return PThis.CBtable.SET.SETatHL(4);
            case 0xE7: return PThis.CBtable.SET.SETn('a',4);
            case 0xE8: return PThis.CBtable.SET.SETn('b',5);
            case 0xE9: return PThis.CBtable.SET.SETn('c',5);
            case 0xEA: return PThis.CBtable.SET.SETn('d',5);
            case 0xEB: return PThis.CBtable.SET.SETn('e',5);
            case 0xEC: return PThis.CBtable.SET.SETn('h',5);
            case 0xED: return PThis.CBtable.SET.SETn('l',5);
            case 0xEE: return PThis.CBtable.SET.SETatHL(5);
            case 0xEF: return PThis.CBtable.SET.SETn('a',5);

            case 0xF0: return PThis.CBtable.SET.SETn('b',6);
            case 0xF1: return PThis.CBtable.SET.SETn('c',6);
            case 0xF2: return PThis.CBtable.SET.SETn('d',6);
            case 0xF3: return PThis.CBtable.SET.SETn('e',6);
            case 0xF4: return PThis.CBtable.SET.SETn('h',6);
            case 0xF5: return PThis.CBtable.SET.SETn('l',6);
            case 0xF6: return PThis.CBtable.SET.SETatHL(6);
            case 0xF7: return PThis.CBtable.SET.SETn('a',6);
            case 0xF8: return PThis.CBtable.SET.SETn('b',7);
            case 0xF9: return PThis.CBtable.SET.SETn('c',7);
            case 0xFA: return PThis.CBtable.SET.SETn('d',7);
            case 0xFB: return PThis.CBtable.SET.SETn('e',7);
            case 0xFC: return PThis.CBtable.SET.SETn('h',7);
            case 0xFD: return PThis.CBtable.SET.SETn('l',7);
            case 0xFE: return PThis.CBtable.SET.SETatHL(7);
            case 0xFF: return PThis.CBtable.SET.SETn('a',7);

        }
    }
}
var p1 = new Processor;


