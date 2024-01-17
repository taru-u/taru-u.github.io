let pokemonImages = ["001 Bulbasaur 1 Grass Poison.png", "002 Ivysaur 1 Grass Poison.png", "003 Venusaur 1 Grass Poison.png", "003 Venusaur Gigantamax 8 Grass Poison.png", "003 Venusaur Mega 6 Grass Poison.png", "004 Charmander 1 Fire.png", "005 Charmeleon 1 Fire.png", "006 Charizard 1 Fire Flying.png", "006 Charizard Gigantamax 8 Fire Flying.png", "006 Charizard Mega X 6 Fire Dragon.png", "006 Charizard Mega Y 6 Fire Flying.png", "007 Squirtle 1 Water.png", "008 Wartortle 1 Water.png", "009 Blastoise 1 Water.png", "009 Blastoise Gigantamax 8 Water.png", "009 Blastoise Mega 6 Water.png", "010 Caterpie 1 Bug.png", "011 Metapod 1 Bug.png", "012 Butterfree 1 Bug Flying.png", "012 Butterfree Gigantamax 8 Bug Flying.png", "013 Weedle 1 Bug Poison.png", "014 Kakuna 1 Bug Poison.png", "015 Beedrill 1 Bug Poison.png", "015 Beedrill Mega 6 Bug Poison.png", "016 Pidgey 1 Normal Flying.png", "017 Pidgeotto 1 Normal Flying.png", "018 Pidgeot 1 Normal Flying.png", "018 Pidgeot Mega 6 Normal Flying.png", "019 Rattata 1 Normal.png", "019 Rattata Alola 7 Dark Normal.png", "020 Raticate 1 Normal.png", "020 Raticate Alola 7 Dark Normal.png", "021 Spearow 1 Normal Flying.png", "022 Fearow 1 Normal Flying.png", "023 Ekans 1 Poison.png", "024 Arbok 1 Poison.png", "025 Pikachu 1 Electric.png", "025 Pikachu Gigantamax 8 Electric.png", "026 Raichu 1 Electric.png", "026 Raichu Alola 7 Electric Psychic.png", "027 Sandshrew 1 Ground.png", "027 Sandshrew Alola 7 Ice Steel.png", "028 Sandslash 1 Ground.png", "028 Sandslash Alola 7 Ice Steel.png", "029 Nidoran\u2640 1 Poison.png", "030 Nidorina 1 Poison.png", "031 Nidoqueen 1 Poison Ground.png", "032 Nidoran\u2642 1 Poison.png", "033 Nidorino 1 Poison.png", "034 Nidoking 1 Poison Ground.png", "035 Clefairy 1 Fairy.png", "036 Clefable 1 Fairt.png", "037 Vulpix 1 Fire.png", "037 Vulpix Alola 7 Ice.png", "038 Ninetales 1 Fire.png", "038 Ninetales Alola 7 Ice Fairy.png", "039 Jigglypuff 1 Normal Fairy.png", "040 Wigglytuff 1 Normal Fairy.png", "041 Zubat 1 Poison Flying.png", "042 Golbat 1 Poison Flying.png", "043 Oddish 1 Grass Poison.png", "044 Gloom 1 Grass Poison.png", "045 Vileplume 1 Grass Poison.png", "046 Paras 1 Bug Grass.png", "047 Parasect 1 Bug Grass.png", "048 Venonat 1 Bug Poison.png", "049 Venomoth 1 Bug Poison.png", "050 Diglett 1 Ground.png", "050 Diglett Alola 7 Ground Steel.png", "051 Dugtrio 1 Ground.png", "051 Dugtrio Alola 7 Ground Steel.png", "052 Meowth 1 Normal.png", "052 Meowth Alola 7 Dark.png", "052 Meowth Galar 8 Steel.png", "052 Meowth Gigantamax 8 Normal.png", "053 Persian 1 Normal.png", "053 Persian Alola 7 Dark.png", "054 Psyduck 1 Water.png", "055 Golduck 1 Water.png", "056 Mankey 1 Fighting.png", "057 Primeape 1 Fighting.png", "058 Growlithe 1 Fire.png", "058 Growlithe Hisui 8 Fire Rock.png", "059 Arcanine 1 Fire.png", "059 Arcanine Hisui 8 Fire Rock.png", "060 Poliwag 1 Water.png", "061 Poliwhirl 1 Water.png", "062 Poliwrath 1 Water Fighting.png", "063 Abra 1 Psychic.png", "064 Kadabra 1 Psychic.png", "065 Alakazam 1 Psychic.png", "065 Alakazam Mega 6 Psychic.png", "066 Machop 1 Fighting.png", "067 Machoke 1 Fighting.png", "068 Machamp 1 Fighting.png", "068 Machamp Gigantamax 8 Fighting.png", "069 Bellsprout 1 Grass Poison.png", "070 Weepinbell 1 Grass Poison.png", "071 Victreebel 1 Grass Poison.png", "072 Tentacool 1 Water Poison.png", "073 Tentacruel 1 Water Poison.png", "074 Geodude 1 Rock Ground.png", "074 Geodude Alola 7 Rock Electric.png", "075 Graveler 1 Rock Ground.png", "075 Graveler Alola 7 Rock Electric.png", "076 Golem 1 Rock Ground.png", "076 Golem Alola 7 Rock Electric.png", "077 Ponyta 1 Fire.png", "077 Ponyta Galar 8 Psychic.png", "078 Rapidash 1 Fire.png", "078 Rapidash Galar 8 Psychic Fairy.png", "079 Slowpoke 1 Water Psychic.png", "079 Slowpoke Galar 8 Psychic.png", "080 Slowbro 1 Water Psychic.png", "080 Slowbro Galar 8 Poison Psychic.png", "080 Slowbro Mega 6 Water Psychic.png", "081 Magnemite 1 Electric Steel.png", "082 Magneton 1 Electric Steel.png", "083 Farfetch'd 1 Normal Flying.png", "083 Farfetch'd Galar 8 Fighting.png", "084 Doduo 1 Normal Flying.png", "085 Dodrio 1 Normal Flying.png", "086 Seel 1 Water.png", "087 Dewgong 1 Water Ice.png", "088 Grimer 1 Poison.png", "088 Grimer Alola 7 Poison Dark.png", "089 Muk Alola 7 Poison Dark.png", "089 Muk 1 Poison.png", "090 Shellder 1 Water.png", "091 Cloyster 1 Water Ice.png", "092 Gastly 1 Ghost Poison.png", "093 Haunter 1 Ghost Poison.png", "094 Gengar 1 Ghost Poison.png", "094 Gengar Gigantamax 8 Ghost Poison.png", "094 Gengar Mega 6 Ghost Poison.png", "095 Onix 1 Rock Ground.png", "096 Drowzee 1 Psychic.png", "097 Hypno 1 Psychic.png", "098 Krabby 1 Water.png", "099 Kingler 1 Water.png", "099 Kingler Gigantamax 8 Water.png", "100 Voltorb 1 Electric.png", "100 Voltorb Hisui 8 Electric Grass.png", "101 Electrode 1 Electric.png", "101 Electrode Hisui 8 Electric Grass.png", "102 Exeggcute 1 Grass Psychic.png", "103 Exeggutor 1 Grass Psychic.png", "103 Exeggutor Alola 7 Grass Dragon.png", "104 Cubone 1 Ground.png", "105 Marowak 1 Ground.png", "105 Marowak Alola 7 Fire Ghost.png", "106 Hitmonlee 1 Fighting.png", "107 Hitmonchan 1 Fighting.png", "108 Lickitung 1 Normal.png", "109 Koffing 1 Poison.png", "110 Weezing 1 Poison.png", "110 Weezing Galar 8 Poison Fairy.png", "111 Rhyhorn 1 Ground Rock.png", "112 Rhydon 1 Ground Rock.png", "113 Chansey 1 Normal.png", "114 Tangela 1 Grass.png", "115 Kangaskhan 1 Normal.png", "115 Kangaskhan Mega 6 Normal.png", "116 Horsea 1 Water.png", "117 Seadra 1 Water.png", "118 Goldeen 1 Water.png", "119 Seaking 1 Water.png", "120 Staryu 1 Water.png", "121 Starmie 1 Water Psychic.png", "122 Mr. Mime 1 Psychic Fairy.png", "122 Mr. Mime Galar 8 Ice Psychic.png", "123 Scyther 1 Bug Flying.png", "124 Jynx 1 Ice Psychic.png", "125 Electabuzz 1 Electric.png", "126 Magmar 1 Fire.png", "127 Pinsir 1 Bug.png", "127 Pinsir Mega 6 Bug Flying.png", "128 Tauros 1 Normal.png", "128 Tauros Paldea Aqua 9 Fighting Water.png", "128 Tauros Paldea Blaze 9 Fighting Fire.png", "128 Tauros Paldea Combat 9 Fighting.png", "129 Magikarp 1 Water.png", "130 Gyarados 1 Water Flying.png", "130 Gyarados Mega 6 Water Dark.png", "131 Lapras 1 Water Ice.png", "131 Lapras Gigantamax 8 Water Ice.png", "132 Ditto 1 Normal.png", "133 Eevee 1 Normal.png", "133 Eevee Gigantamax 8 Normal.png", "134 Vaporeon 1 Water.png", "135 Jolteon 1 Electric.png", "136 Flareon 1 Fire.png", "137 Porygon 1 Normal.png", "138 Omanyte 1 Rock Water.png", "139 Omastar 1 Rock Water.png", "140 Kabuto 1 Rock Water.png", "141 Kabutops 1 Rock Water.png", "142 Aerodactyl 1 Rock Flying.png", "142 Aerodactyl Mega 6 Rock Flying.png", "143 Snorlax 1 Normal.png", "143 Snorlax Gigantamax 8 Normal.png", "144 Articuno 1 Ice Flying.png", "144 Articuno Galar 8 Psychic Flying.png", "145 Zapdos 1 Electric Flying.png", "145 Zapdos Galar 8 Fighting Flying.png", "146 Moltres 1 Fire Flying.png", "146 Moltres Galar 8 Dark Flying.png", "147 Dratini 1 Dragon.png", "148 Dragonair 1 Dragon.png", "149 Dragonite 1 Dragon Flying.png", "150 Mewtwo 1 Psychic.png", "150 Mewtwo Mega X 6 Psychic Fighting.png", "150 Mewtwo Mega Y 6 Psychic.png", "151 Mew 1 Psychic.png", "152 Chikorita 2 Grass.png", "153 Bayleef 2 Grass.png", "154 Meganium 2 Grass.png", "155 Cyndaquil 2 Fire.png", "156 Quilava 2 Fire.png", "157 Typhlosion 2 Fire.png", "157 Typhlosion Hisui 8 Fire Ghost.png", "158 Totodile 2 Water.png", "159 Croconaw 2 Water.png", "160 Feraligatr 2 Water.png", "161 Sentret 2 Normal.png", "162 Furret 2 Normal.png", "163 Hoothoot 2 Normal Flying.png", "164 Noctowl 2 Normal Flying.png", "165 Ledyba 2 Bug Flying.png", "166 Ledian 2 Bug Flying.png", "167 Spinarak 2 Bug Poison.png", "168 Ariados 2 Bug Poison.png", "169 Crobat 2 Poison Flying.png", "170 Chinchou 2 Water Electric.png", "171 Lanturn 2 Water Electric.png", "172 Pichu 2 Electric.png", "173 Cleffa 2 Fairy.png", "174 Igglybuff 2 Normal Fairy.png", "175 Togepi 2 Fairy.png", "176 Togetic 2 Fairy Flying.png", "177 Natu 2 Psychic Flying.png", "178 Xatu 2 Psychic Flying.png", "179 Mareep 2 Electric.png", "180 Flaaffy 2 Electric.png", "181 Ampharos 2 Electric.png", "181 Ampharos Mega 6 Electric Dragon.png", "182 Bellossom 2 Grass.png", "183 Marill 2 Water Fairy.png", "184 Azumarill 2 Water Fairy.png", "185 Sudowoodo 2 Rock.png", "186 Politoed 2 Water.png", "187 Hoppip 2 Grass Flying.png", "188 Skiploom 2 Grass Flying.png", "189 Jumpluff 2 Grass Flying.png", "190 Aipom 2 Normal.png", "191 Sunkern 2 Grass.png", "192 Sunflora 2 Grass.png", "193 Yanma 2 Bug Flying.png", "194 Wooper 2 Water Ground.png", "194 Wooper Paldea 9 Poison Ground.png", "195 Quagsire 2 Water Ground.png", "196 Espeon 2 Psychic.png", "197 Umbreon 2 Dark.png", "198 Murkrow 2 Dark Flying.png", "199 Slowking 2 Water Psychic.png", "199 Slowking Galar 8 Poison Psychic.png", "200 Misdreavus 2 Ghost.png", "201 Unown 2 Psychic.png", "202 Wobbuffet 2 Psychic.png", "203 Girafarig 2 Normal Psychic.png", "204 Pineco 2 Bug.png", "205 Forretress 2 Bug Steel.png", "206 Dunsparce 2 Normal.png", "207 Gligar 2 Ground Flying.png", "208 Steelix 2 Steel Ground.png", "208 Steelix Mega 6 Steel Ground.png", "209 Snubbull 2 Fairy.png", "210 Granbull 2 Fairy.png", "211 Qwilfish 2 Water Poison.png", "211 Qwilfish Hisui 8 Dark Poison.png", "212 Scizor 2 Bug Steel.png", "212 Scizor Mega 6 Bug Steel.png", "213 Shuckle 2 Bug Rock.png", "214 Heracross 2 Bug Fighting.png", "214 Heracross Mega 6 Bug Fighting.png", "215 Sneasel 2 Dark Ice.png", "215 Sneasel Hisui 8 Fighting Poison.png", "216 Teddiursa 2 Normal.png", "217 Ursaring 2 Normal.png", "218 Slugma 2 Fire.png", "219 Magcargo 2 Fire Rock.png", "220 Swinub 2 Ice Ground.png", "221 Piloswine 2 Ice Ground.png", "222 Corsola 2 Water Rock.png", "222 Corsola Galar 8 Ghost.png", "223 Remoraid 2 Water.png", "224 Octillery 2 Water.png", "225 Delibird 2 Ice Flying.png", "226 Mantine 2 Water Flying.png", "227 Skarmory 2 Steel Flying.png", "228 Houndour 2 Dark Fire.png", "229 Houndoom 2 Dark Fire.png", "229 Houndoom Mega 6 Dark Fire.png", "230 Kingdra 2 Water Dragon.png", "231 Phanpy 2 Ground.png", "232 Donphan 2 Ground.png", "233 Porygon2 2 Normal.png", "234 Stantler 2 Normal.png", "235 Smeargle 2 Normal.png", "236 Tyrogue 2 Fighting.png", "237 Hitmontop 2 Fighting.png", "238 Smoochum 2 Ice Psychic.png", "239 Elekid 2 Electric.png", "240 Magby 2 Fire.png", "241 Miltank 2 Normal.png", "242 Blissey 2 Normal.png", "243 Raikou 2 Electric.png", "244 Entei 2 Fire.png", "245 Suicune 2 Water.png", "246 Larvitar 2 Rock Ground.png", "247 Pupitar 2 Rock Ground.png", "248 Tyranitar 2 Rock Dark.png", "248 Tyranitar Mega 6 Rock Dark.png", "249 Lugia 2 Psychic Flying.png", "250 Ho-Oh 2 Fire Flying.png", "251 Celebi 2 Psychic Grass.png", "252 Treecko 3 Grass.png", "253 Grovyle 3 Grass.png", "254 Sceptile 3 Grass.png", "254 Sceptile Mega 6 Grass Dragon.png", "255 Torchic 3 Fire.png", "256 Combusken 3 Fire Fighting.png", "257 Blaziken 3 Fire Fighting.png", "257 Blaziken Mega 6 Fire Fighting.png", "258 Mudkip 3 Water.png", "259 Marshtomp 3 Water Ground.png", "260 Swampert 3 Water Ground.png", "260 Swampert Mega 6 Water Ground.png", "261 Poochyena 3 Dark.png", "262 Mightyena 3 Dark.png", "263 Zigzagoon 3 Normal.png", "263 Zigzagoon Galar 8 Dark Normal.png", "264 Linoone 3 Normal.png", "264 Linoone Galar 8 Dark Normal.png", "265 Wurmple 3 Bug.png", "266 Silcoon 3 Bug.png", "267 Beautifly 3 Bug Flying.png", "268 Cascoon 3 Bug.png", "269 Dustox 3 Bug Poison.png", "270 Lotad 3 Water Grass.png", "271 Lombre 3 Water Grass.png", "272 Ludicolo 3 Water Grass.png", "273 Seedot 3 Grass.png", "274 Nuzleaf 3 Grass Dark.png", "275 Shiftry 3 Grass Dark.png", "276 Taillow 3 Normal Flying.png", "277 Swellow 3 Normal Flying.png", "278 Wingull 3 Water Flying.png", "279 Pelipper 3 Water Flying.png", "280 Ralts 3 Psychic Fairy.png", "281 Kirlia 3 Psychic Fairy.png", "282 Gardevoir 3 Psychic Fairy.png", "282 Gardevoir Mega 6 Psychic Fairy.png", "283 Surskit 3 Bug Water.png", "284 Masquerain 3 Bug Flying.png", "285 Shroomish 3 Grass.png", "286 Breloom 3 Grass Fighting.png", "287 Slakoth 3 Normal.png", "288 Vigoroth 3 Normal.png", "289 Slaking 3 Normal.png", "290 Nincada 3 Bug Ground.png", "291 Ninjask 3 Bug Flying.png", "292 Shedinja 3 Bug Ghost.png", "293 Whismur 3 Normal.png", "294 Loudred 3 Normal.png", "295 Exploud 3 Normal.png", "296 Makuhita 3 Fighting.png", "297 Hariyama 3 Fighting.png", "298 Azurill 3 Normal Fairy.png", "299 Nosepass 3 Rock.png", "300 Skitty 3 Normal.png", "301 Delcatty 3 Normal.png", "302 Sableye 3 Dark Ghost.png", "302 Sableye Mega 6 Dark Ghost.png", "303 Mawile 3 Steel Fairy.png", "303 Mawile Mega 6 Steel Fairy.png", "304 Aron 3 Steel Rock.png", "305 Lairon 3 Steel Rock.png", "306 Aggron 3 Steel Rock.png", "306 Aggron Mega 6 Steel.png", "307 Meditite 3 Fighting Psychic.png", "308 Medicham 3 Fighting Psychic.png", "308 Medicham Mega 6 Fighting Psychic.png", "309 Electrike 3 Electric.png", "310 Manectric 3 Electric.png", "310 Manectric Mega 6 Electric.png", "311 Plusle 3 Electric.png", "312 Minun 3 Electric.png", "313 Volbeat 3 Bug.png", "314 Illumise 3 Bug.png", "315 Roselia 3 Grass Poison.png", "316 Gulpin 3 Poison.png", "317 Swalot 3 Poison.png", "318 Carvanha 3 Water Dark.png", "319 Sharpedo 3 Water Dark.png", "319 Sharpedo Mega 6 Water Dark.png", "320 Wailmer 3 Water.png", "321 Wailord 3 Water.png", "322 Numel 3 Fire Ground.png", "323 Camerupt 3 Fire Ground.png", "323 Camerupt Mega 6 Fire Ground.png", "324 Torkoal 3 Fire.png", "325 Spoink 3 Psychic.png", "326 Grumpig 3 Psychic.png", "327 Spinda 3 Normal.png", "328 Trapinch 3 Ground.png", "329 Vibrava 3 Ground Dragon.png", "330 Flygon 3 Ground Dragon.png", "331 Cacnea 3 Grass.png", "332 Cacturne 3 Grass Dark.png", "333 Swablu 3 Normal Flying.png", "334 Altaria 3 Dragon Flying.png", "334 Altaria Mega 6 Dragon Fairy.png", "335 Zangoose 3 Normal.png", "336 Seviper 3 Poison.png", "337 Lunatone 3 Rock Psychic.png", "338 Solrock 3 Rock Psychic.png", "339 Barboach 3 Water Ground.png", "340 Whiscash 3 Water Ground.png", "341 Corphish 3 Water.png", "342 Crawdaunt 3 Water Dark.png", "343 Baltoy 3 Ground Psychic.png", "344 Claydol 3 Ground Psychic.png", "345 Lileep 3 Rock Grass.png", "346 Cradily 3 Rock Grass.png", "347 Anorith 3 Rock Bug.png", "348 Armaldo 3 Rock Bug.png", "349 Feebas 3 Water.png", "350 Milotic 3 Water.png", "351 Castform 3 Normal.png", "351 Castform Rainy 3 Water.png", "351 Castform Snowy 3 Ice.png", "351 Castform Sunny 3 Fire.png", "352 Kecleon 3 Normal.png", "353 Shuppet 3 Ghost.png", "354 Banette 3 Ghost.png", "354 Banette Mega 6 Ghost.png", "355 Duskull 3 Ghost.png", "356 Dusclops 3 Ghost.png", "357 Tropius 3 Grass Flying.png", "358 Chimecho 3 Psychic.png", "359 Absol 3 Dark.png", "359 Absol Mega 6 Dark.png", "360 Wynaut 3 Psychic.png", "361 Snorunt 3 Ice.png", "362 Glalie 3 Ice.png", "362 Glalie Mega 6 Ice.png", "363 Spheal 3 Ice Water.png", "364 Sealeo 3 Ice Water.png", "365 Walrein 3 Ice Water.png", "366 Clamperl 3 Water.png", "367 Huntail 3 Water.png", "368 Gorebyss 3 Water.png", "369 Relicanth 3 Water Rock.png", "370 Luvdisc 3 Water.png", "371 Bagon 3 Dragon.png", "372 Shelgon 3 Dragon.png", "373 Salamence 3 Dragon Flying.png", "373 Salamence Mega 6 Dragon Flying.png", "374 Beldum 3 Steel Psychic.png", "375 Metang 3 Steel Psychic.png", "376 Metagross 3 Steel Psychic.png", "376 Metagross Mega 6 Steel Psychic.png", "377 Regirock 3 Rock.png", "378 Regice 3 Ice.png", "379 Registeel 3 Steel.png", "380 Latias 3 Dragon Psychic.png", "380 Latias Mega 6 Dragon Psychic.png", "381 Latios 3 Dragon Psychic.png", "381 Latios Mega 6 Dragon Psychic.png", "382 Kyogre 3 Water.png", "382 Kyogre Primal 6 Water.png", "383 Groudon 3 Ground.png", "383 Groudon Primal 6 Ground Fire.png", "384 Rayquaza 3 Dragon Flying.png", "384 Rayquaza Mega 6 Dragon Flying.png", "385 Jirachi 3 Steel Psychic.png", "386 Deoxys 3 Psychic.png", "386 Deoxys Attack 3 Psychic.png", "386 Deoxys Defense 3 Psychic.png", "386 Deoxys Speed 3 Psychic.png", "387 Turtwig 4 Grass.png", "388 Grotle 4 Grass.png", "389 Torterra 4 Grass Ground.png", "390 Chimchar 4 Fire.png", "391 Monferno 4 Fire Fighting.png", "392 Infernape 4 Fire Fighting.png", "393 Piplup 4 Water.png", "394 Prinplup 4 Water.png", "395 Empoleon 4 Water Steel.png", "396 Starly 4 Normal Flying.png", "397 Staravia 4 Normal Flying.png", "398 Staraptor 4 Normal Flying.png", "399 Bidoof 4 Normal.png", "400 Bibarel 4 Normal Water.png", "401 Kricketot 4 Bug.png", "402 Kricketune 4 Bug.png", "403 Shinx 4 Electric.png", "404 Luxio 4 Electric.png", "405 Luxray 4 Electric.png", "406 Budew 4 Grass Poison.png", "407 Roserade 4 Grass Poison.png", "408 Cranidos 4 Rock.png", "409 Rampardos 4 Rock.png", "410 Shieldon 4 Rock Steel.png", "411 Bastiodon 4 Rock Steel.png", "412 Burmy 4 Bug.png", "413 Wormadam Plant Cloak 4 Bug Grass.png", "413 Wormadam Sandy Cloak 4 Bug Ground.png", "413 Wormadam Trash Cloak 4 Bug Steel.png", "414 Mothim 4 Bug Flying.png", "415 Combee 4 Bug Flying.png", "416 Vespiquen 4 Bug Flying.png", "417 Pachirisu 4 Electric.png", "418 Buizel 4 Water.png", "419 Floatzel 4 Water.png", "420 Cherubi 4 Grass.png", "421 Cherrim Overcast 4 Grass.png", "421 Cherrim Sunshine 4 Grass.png", "422 Shellos 4 Water.png", "423 Gastrodon 4 Water Ground.png", "424 Ambipom 4 Normal.png", "425 Drifloon 4 Ghost Flying.png", "426 Drifblim 4 Ghost Flying.png", "427 Buneary 4 Normal.png", "428 Lopunny 4 Normal.png", "428 Lopunny Mega 6 Normal Fighting.png", "429 Mismagius 4 Ghost.png", "430 Honchkrow 4 Dark Flying.png", "431 Glameow 4 Normal.png", "432 Purugly 4 Normal.png", "433 Chingling 4 Psychic.png", "434 Stunky 4 Poison.png", "435 Skuntank 4 Poison.png", "436 Bronzor 4 Steel Psychic.png", "437 Bronzong 4 Steel Psychic.png", "438 Bonsly 4 Rock.png", "439 Mime Jr. 4 Psychic Fairy.png", "440 Happiny 4 Normal.png", "441 Chatot 4 Normal Flying.png", "442 Spiritomb 4 Ghost Dark.png", "443 Gible 4 Dragon Ground.png", "444 Gabite 4 Dragon Ground.png", "445 Garchomp 4 Dragon Ground.png", "445 Garchomp Mega 6 Dragon Ground.png", "446 Munchlax 4 Normal.png", "447 Riolu 4 Fighting.png", "448 Lucario 4 Fighting Steel.png", "448 Lucario Mega 6 Fighting Steel.png", "449 Hippopotas 4 Ground.png", "450 Hippowdon 4 Ground.png", "451 Skorupi 4 Poison Bug.png", "452 Drapion 4 Poison Dark.png", "453 Croagunk 4 Poison Fighting.png", "454 Toxicroak 4 Poison Fighting.png", "455 Carnivine 4 Grass.png", "456 Finneon 4 Water.png", "457 Lumineon 4 Water.png", "458 Mantyke 4 Water Flying.png", "459 Snover 4 Grass Ice.png", "460 Abomasnow 4 Grass Ice.png", "460 Abomasnow Mega 6 Grass Ice.png", "461 Weavile 4 Dark Ice.png", "462 Magnezone 4 Electric Steel.png", "463 Lickilicky 4 Normal.png", "464 Rhyperior 4 Ground Rock.png", "465 Tangrowth 4 Grass.png", "466 Electivire 4 Electric.png", "467 Magmortar 4 Fire.png", "468 Togekiss 4 Fairy Flying.png", "469 Yanmega 4 Bug Flying.png", "470 Leafeon 4 Grass.png", "471 Glaceon 4 Ice.png", "472 Gliscor 4 Ground Flying.png", "473 Mamoswine 4 Ice Ground.png", "474 Porygon-Z 4 Normal.png", "475 Gallade 4 Psychic Fighting.png", "475 Gallade Mega 6 Psychic Fighting.png", "476 Probopass 4 Rock Steel.png", "477 Dusknoir 4 Ghost.png", "478 Froslass 4 Ice Ghost.png", "479 Rotom 4 Electric Ghost.png", "479 Rotom Fan 4 Electric Flying.png", "479 Rotom Frost 4 Electric Ice.png", "479 Rotom Heat 4 Electric Fire.png", "479 Rotom Mow 4 Electric Grass.png", "479 Rotom Wash 4 Electric Water.png", "480 Uxie 4 Psychic.png", "481 Mesprit 4 Psychic.png", "482 Azelf 4 Psychic.png", "483 Dialga 4 Steel Dragon.png", "483 Dialga Origin 8 Steel Dragon.png", "484 Palkia 4 Water Dragon.png", "484 Palkia Origin 8 Water Dragon.png", "485 Heatran 4 Fire Steel.png", "486 Regigigas 4 Normal.png", "487 Giratina Altered 4 Ghost Dragon.png", "487 Giratina Origin 4 Ghost Dragon.png", "488 Cresselia 4 Psychic.png", "489 Phione 4 Water.png", "490 Manaphy 4 Water.png", "491 Darkrai 4 Dark.png", "492 Shaymin Land 4 Grass.png", "492 Shaymin Sky 4 Grass Flying.png", "493 Arceus 4 Normal.png", "494 Victini 5 Psychic Fire.png", "495 Snivy 5 Grass.png", "496 Servine 5 Grass.png", "497 Serperior 5 Grass.png", "498 Tepig 5 Fire.png", "499 Pignite 5 Fire Fighting.png", "500 Emboar 5 Fire Fighting.png", "501 Oshawott 5 Water.png", "502 Dewott 5 Water.png", "503 Samurott 5 Water.png", "503 Samurott Hisui 8 Water Dark.png", "504 Patrat 5 Normal.png", "505 Watchog 5 Normal.png", "506 Lillipup 5 Normal.png", "507 Herdier 5 Normal.png", "508 Stoutland 5 Normal.png", "509 Purrloin 5 Dark.png", "510 Liepard 5 Dark.png", "511 Pansage 5 Grass.png", "512 Simisage 5 Grass.png", "513 Pansear 5 Fire.png", "514 Simisear 5 Fire.png", "515 Panpour 5 Water.png", "516 Simipour 5 Water.png", "517 Munna 5 Psychic.png", "518 Musharna 5 Psychic.png", "519 Pidove 5 Normal Flying.png", "520 Tranquill 5 Normal Flying.png", "521 Unfezant 5 Normal Flying.png", "522 Blitzle 5 Electric.png", "523 Zebstrika 5 Electric.png", "524 Roggenrola 5 Rock.png", "525 Boldore 5 Rock.png", "526 Gigalith 5 Rock.png", "527 Woobat 5 Psychic Flying.png", "528 Swoobat 5 Psychic Flying.png", "529 Drilbur 5 Ground.png", "530 Excadrill 5 Ground Steel.png", "531 Audino 5 Normal.png", "531 Audino Mega 6 Normal Fairy.png", "532 Timburr 5 Fighting.png", "533 Gurdurr 5 Fighting.png", "534 Conkeldurr 5 Fighting.png", "535 Tympole 5 Water.png", "536 Palpitoad 5 Water Ground.png", "537 Seismitoad 5 Water Ground.png", "538 Throh 5 Fighting.png", "539 Sawk 5 Fighting.png", "540 Sewaddle 5 Bug Grass.png", "541 Swadloon 5 Bug Grass.png", "542 Leavanny 5 Bug Grass.png", "543 Venipede 5 Bug Poison.png", "544 Whirlipede 5 Bug Poison.png", "545 Scolipede 5 Bug Poison.png", "546 Cottonee 5 Grass Fairy.png", "547 Whimsicott 5 Grass Fairy.png", "548 Petilil 5 Grass.png", "549 Lilligant 5 Grass.png", "549 Lilligant Hisui 8 Grass Fighting.png", "550 Basculin Blue 5 Water.png", "550 Basculin Red 5 Water.png", "550 Basculin White 8 Water.png", "551 Sandile 5 Ground Dark.png", "552 Krokorok 5 Ground Dark.png", "553 Krookodile 5 Ground Dark.png", "554 Darumaka 5 Fire.png", "554 Darumaka Galar 8 Ice.png", "555 Darmanitan 5 Fire.png", "555 Darmanitan Galar 8 Ice.png", "555 Darmanitan Galar Zen 8 Ice Fire.png", "555 Darmanitan Zen 5 Fire Psychic.png", "556 Maractus 5 Grass.png", "557 Dwebble 5 Bug Rock.png", "558 Crustle 5 Bug Rock.png", "559 Scraggy 5 Dark Fighting.png", "560 Scrafty 5 Dark Fighting.png", "561 Sigilyph 5 Psychic Flying.png", "562 Yamask 5 Ghost.png", "562 Yamask Galar 8 Ground Ghost.png", "563 Cofagrigus 5 Ghost.png", "564 Tirtouga 5 Water Rock.png", "565 Carracosta 5 Water Rock.png", "566 Archen 5 Rock Flying.png", "567 Archeops 5 Rock Flying.png", "568 Trubbish 5 Poison.png", "569 Garbodor 5 Poison.png", "569 Garbodor Gigantamax 8 Poison.png", "570 Zorua 5 Dark.png", "570 Zorua Hisui 8 Normal Ghost.png", "571 Zoroark 5 Dark.png", "571 Zoroark Hisui 8 Normal Ghost.png", "572 Minccino 5 Normal.png", "573 Cinccino 5 Normal.png", "574 Gothita 5 Psychic.png", "575 Gothorita 5 Psychic.png", "576 Gothitelle 5 Psychic.png", "577 Solosis 5 Psychic.png", "578 Duosion 5 Psychic.png", "579 Reuniclus 5 Psychic.png", "580 Ducklett 5 Water Flying.png", "581 Swanna 5 Water Flying.png", "582 Vanillite 5 Ice.png", "583 Vanillish 5 Ice.png", "584 Vanilluxe 5 Ice.png", "585 Deerling 5 Normal Grass.png", "586 Sawsbuck 5 Normal Grass.png", "587 Emolga 5 Electric Flying.png", "588 Karrablast 5 Bug.png", "589 Escavalier 5 Bug Steel.png", "590 Foongus 5 Grass Poison.png", "591 Amoonguss 5 Grass Poison.png", "592 Frillish 5 Water Ghost.png", "593 Jellicent 5 Water Ghost.png", "594 Alomomola 5 Water.png", "595 Joltik 5 Bug Electric.png", "596 Galvantula 5 Bug Electric.png", "597 Ferroseed 5 Grass Steel.png", "598 Ferrothorn 5 Grass Steel.png", "599 Klink 5 Steel.png", "600 Klang 5 Steel.png", "601 Klinklang 5 Steel.png", "602 Tynamo 5 Electric.png", "603 Eelektrik 5 Electric.png", "604 Eelektross 5 Electric.png", "605 Elgyem 5 Psychic.png", "606 Beheeyem 5 Psychic.png", "607 Litwick 5 Ghost Fire.png", "608 Lampent 5 Ghost Fire.png", "609 Chandelure 5 Ghost Fire.png", "610 Axew 5 Dragon.png", "611 Fraxure 5 Dragon.png", "612 Haxorus 5 Dragon.png", "613 Cubchoo 5 Ice.png", "614 Beartic 5 Ice.png", "615 Cryogonal 5 Ice.png", "616 Shelmet 5 Bug.png", "617 Accelgor 5 Bug.png", "618 Stunfisk 5 Ground Electric.png", "618 Stunfisk Galar 8 Ground Steel.png", "619 Mienfoo 5 Fighting.png", "620 Mienshao 5 Fighting.png", "621 Druddigon 5 Dragon.png", "622 Golett 5 Ground Ghost.png", "623 Golurk 5 Ground Ghost.png", "624 Pawniard 5 Dark Steel.png", "625 Bisharp 5 Dark Steel.png", "626 Bouffalant 5 Normal.png", "627 Rufflet 5 Normal Flying.png", "628 Braviary 5 Normal Flying.png", "628 Braviary Hisui 8 Psychic Flying.png", "629 Vullaby 5 Dark Flying.png", "630 Mandibuzz 5 Dark Flying.png", "631 Heatmor 5 Fire.png", "632 Durant 5 Bug Steel.png", "633 Deino 5 Dark Dragon.png", "634 Zweilous 5 Dark Dragon.png", "635 Hydreigon 5 Dark Dragon.png", "636 Larvesta 5 Bug Fire.png", "637 Volcarona 5 Bug Fire.png", "638 Cobalion 5 Steel Fighting.png", "639 Terrakion 5 Rock Fighting.png", "640 Virizion 5 Grass Fighting.png", "641 Tornadus Incarnate 5 Flying.png", "641 Tornadus Therian 5 Flying.png", "642 Thundurus Incarnate 5 Electric Flying.png", "642 Thundurus Therian 5 Electric Flying.png", "643 Reshiram 5 Dragon Fire.png", "644 Zekrom 5 Dragon Electric.png", "645 Landorus Incarnate 5 Ground Flying.png", "645 Landorus Therian 5 Ground Flying.png", "646 Kyurem 5 Dragon Ice.png", "646 Kyurem Black 5 Dragon Ice.png", "646 Kyurem White 5 Dragon Ice.png", "647 Keldeo 5 Water Fighting.png", "647 Keldeo Resolute 5 Water Fighting.png", "648 Meloetta Aria 5 Normal Psychic.png", "648 Meloetta Pirouette 5 Normal Fighting.png", "649 Genesect 5 Bug Steel.png", "650 Chespin 6 Grass.png", "651 Quilladin 6 Grass.png", "652 Chesnaught 6 Grass Fighting.png", "653 Fennekin 6 Fire.png", "654 Braixen 6 Fire.png", "655 Delphox 6 Fire Psychic.png", "656 Froakie 6 Water.png", "657 Frogadier 6 Water.png", "658 Greninja 6 Water Dark.png", "658 Greninja Ash-Greninja 7 Water Dark.png", "659 Bunnelby 6 Normal.png", "660 Diggersby 6 Normal Ground.png", "661 Fletchling 6 Normal Flying.png", "662 Fletchinder 6 Fire Flying.png", "663 Talonflame 6 Fire Flying.png", "664 Scatterbug 6 Bug.png", "665 Spewpa 6 Bug.png", "666 Vivillon 6 Bug Flying.png", "667 Litleo 6 Fire Normal.png", "668 Pyroar 6 Fire Normal.png", "669 Flab\u00e9b\u00e9 6 Fairy.png", "670 Floette 6 Fairy.png", "671 Florges 6 Fairy.png", "672 Skiddo 6 Grass.png", "673 Gogoat 6 Grass.png", "674 Pancham 6 Fighting.png", "675 Pangoro 6 Fighting Dark.png", "676 Furfrou 6 Normal.png", "677 Espurr 6 Psychic.png", "678 Meowstic 6 Psychic.png", "679 Honedge 6 Steel Ghost.png", "680 Doublade 6 Steel Ghost.png", "681 Aegislash 6 Steel Ghost.png", "682 Spritzee 6 Fairy.png", "683 Aromatisse 6 Fairy.png", "684 Swirlix 6 Fairy.png", "685 Slurpuff 6 Fairy.png", "686 Inkay 6 Dark Psychic.png", "687 Malamar 6 Dark Psychic.png", "688 Binacle 6 Rock Water.png", "689 Barbaracle 6 Rock Water.png", "690 Skrelp 6 Poison Water.png", "691 Dragalge 6 Poison Dragon.png", "692 Clauncher 6 Water.png", "693 Clawitzer 6 Water.png", "694 Helioptile 6 Electric Normal.png", "695 Heliolisk 6 Electric Normal.png", "696 Tyrunt 6 Rock Dragon.png", "697 Tyrantrum 6 Rock Dragon.png", "698 Amaura 6 Rock Ice.png", "699 Aurorus 6 Rock Ice.png", "700 Sylveon 6 Fairy.png", "701 Hawlucha 6 Fighting Flying.png", "702 Dedenne 6 Electric Fairy.png", "703 Carbink 6 Rock Fairy.png", "704 Goomy 6 Dragon.png", "705 Sliggoo 6 Dragon.png", "705 Sliggoo Hisui 8 Steel Dragon.png", "706 Goodra 6 Dragon.png", "706 Goodra Hisui 8 Steel Dragon.png", "707 Klefki 6 Steel Fairy.png", "708 Phantump 6 Ghost Grass.png", "709 Trevenant 6 Ghost Grass.png", "710 Pumpkaboo 6 Ghost Grass.png", "711 Gourgeist 6 Ghost Grass.png", "712 Bergmite 6 Ice.png", "713 Avalugg 6 Ice.png", "713 Avalugg Hisui 8 Ice Rock.png", "714 Noibat 6 Flying Dragon.png", "715 Noivern 6 Flying Dragon.png", "716 Xerneas 6 Fairy.png", "717 Yveltal 6 Dark Flying.png", "718 Zygarde 10\u0025 7 Dragon Ground.png", "718 Zygarde 50\u0025 6 Dragon Ground.png", "718 Zygarde Complete 7 Dragon Ground.png", "719 Diancie 6 Rock Fairy.png", "719 Diancie Mega 6 Rock Fairy.png", "720 Hoopa Confined 6 Psychic Ghost.png", "720 Hoopa Unbound 6 Psychic Dark.png", "721 Volcanion 6 Fire Water.png", "722 Rowlet 7 Grass Flying.png", "723 Dartrix 7 Grass Flying.png", "724 Decidueye 7 Grass Ghost.png", "724 Decidueye Hisui 8 Grass Fighting.png", "725 Litten 7 Fire.png", "726 Torracat 7 Fire.png", "727 Incineroar 7 Fire Dark.png", "728 Popplio 7 Water.png", "729 Brionne 7 Water.png", "730 Primarina 7 Water Fairy.png", "731 Pikipek 7 Normal Flying.png", "732 Trumbeak 7 Normal Flying.png", "733 Toucannon 7 Normal Flying.png", "734 Yungoos 7 Normal.png", "735 Gumshoos 7 Normal.png", "736 Grubbin 7 Bug.png", "737 Charjabug 7 Bug Electric.png", "738 Vikavolt 7 Bug Electric.png", "739 Crabrawler 7 Fighting.png", "740 Crabominable 7 Fighting Ice.png", "741 Oricorio Baile 7 Fire Flying.png", "741 Oricorio Pa'u 7 Psychic Fighting.png", "741 Oricorio Pom-Pom 7 Electric Flying.png", "741 Oricorio Sensu 7 Ghost Flying.png", "742 Cutiefly 7 Bug Fairy.png", "743 Ribombee 7 Bug Fairy.png", "744 Rockruff 7 Rock.png", "745 Lycanroc Midday 7 Rock.png", "745 Lycanroc Dusk 7 Rock.png", "745 Lycanroc Midnight 7 Rock.png", "746 Wishiwashi Solo 7 Water.png", "746 Wishiwashi School 7 Water.png", "747 Mareanie 7 Poison Water.png", "748 Toxapex 7 Poison Water.png", "749 Mudbray 7 Ground.png", "750 Mudsdale 7 Ground.png", "751 Dewpider 7 Water Bug.png", "752 Araquanid 7 Water Bug.png", "753 Fomantis 7 Grass.png", "754 Lurantis 7 Grass.png", "755 Morelull 7 Grass Fairy.png", "756 Shiinotic 7 Grass Fairy.png", "757 Salandit 7 Poison Fire.png", "758 Salazzle 7 Poison Fire.png", "759 Stufful 7 Normal Fighting.png", "760 Bewear 7 Normal Fighting.png", "761 Bounsweet 7 Grass.png", "762 Steenee 7 Grass.png", "763 Tsareena 7 Grass.png", "764 Comfey 7 Fairy.png", "765 Oranguru 7 Normal Psychic.png", "766 Passimian 7 Fighting.png", "767 Wimpod 7 Bug Water.png", "768 Golisopod 7 Bug Water.png", "769 Sandygast 7 Ghost Ground.png", "770 Palossand 7 Ghost Ground.png", "771 Pyukumuku 7 Water.png", "772 Type Null 7 Normal.png", "773 Silvally 7 Normal.png", "774 Minior Meteor 7 Rock Flying.png", "774 Minior Core 7 Rock Flying.png", "775 Komala 7 Normal.png", "776 Turtonator 7 Fire Dragon.png", "777 Togedemaru 7 Electric Steel.png", "778 Mimikyu 7 Ghost Fairy.png", "779 Bruxish 7 Water Psychic.png", "780 Drampa 7 Normal Dragon.png", "781 Dhelmise 7 Ghost Grass.png", "782 Jangmo-o 7 Dragon.png", "783 Hakamo-o 7 Dragon Fighting.png", "784 Kommo-o 7 Dragon Fighting.png", "785 Tapu Koko 7 Electric Fairy.png", "786 Tapu Lele 7 Psychic Fairy.png", "787 Tapu Bulu 7 Grass Fairy.png", "788 Tapu Fini 7 Water Fairy.png", "789 Cosmog 7 Psychic.png", "790 Cosmoem 7 Psychic.png", "791 Solgaleo 7 Psychic Steel.png", "792 Lunala 7 Psychic Ghost.png", "793 Nihilego 7 Rock Poison.png", "794 Buzzwole 7 Bug Fighting.png", "795 Pheromosa 7 Bug Fighting.png", "796 Xurkitree 7 Electric.png", "797 Celesteela 7 Steel Flying.png", "798 Kartana 7 Grass Steel.png", "799 Guzzlord 7 Dark Dragon.png", "800 Necrozma 7 Psychic.png", "800 Necrozma Dawn Wings 7 Psychic Ghost.png", "800 Necrozma Dusk Mane 7 Psychic Steel.png", "800 Necrozma Ultra 7 Psychic Dragon.png", "801 Magearna 7 Steel Fairy.png", "802 Marshadow 7 Fighting Ghost.png", "803 Poipole 7 Poison.png", "804 Naganadel 7 Poison Dragon.png", "805 Stakataka 7 Rock Steel.png", "806 Blacephalon 7 Fire Ghost.png", "807 Zeraora 7 Electric.png", "808 Meltan 7 Steel.png", "809 Melmetal 7 Steel.png", "809 Melmetal Gigantamax 8 Steel.png", "810 Grookey 8 Grass.png", "811 Thwackey 8 Grass.png", "812 Rillaboom 8 Grass.png", "812 Rillaboom Gigantamax 8 Grass.png", "813 Scorbunny 8 Fire.png", "814 Raboot 8 Fire.png", "815 Cinderace 8 Fire.png", "815 Cinderace Gigantamax 8 Fire.png", "816 Sobble 8 Water.png", "817 Drizzile 8 Water.png", "818 Inteleon 8 Water.png", "818 Inteleon Gigantamax 8 Water.png", "819 Skwovet 8 Normal.png", "820 Greedent 8 Normal.png", "821 Rookidee 8 Flying.png", "822 Corvisquire 8 Flying.png", "823 Corviknight 8 Flying Steel.png", "823 Corviknight Gigantamax 8 Flying Steel.png", "824 Blipbug 8 Bug.png", "825 Dottler 8 Bug Psychic.png", "826 Orbeetle 8 Bug Psychic.png", "826 Orbeetle Gigantamax 8 Bug Psychic.png", "827 Nickit 8 Dark.png", "828 Thievul 8 Dark.png", "829 Gossifleur 8 Grass.png", "830 Eldegoss 8 Grass.png", "831 Wooloo 8 Normal.png", "832 Dubwool 8 Normal.png", "833 Chewtle 8 Water.png", "834 Drednaw 8 Water Rock.png", "834 Drednaw Gigantamax 8 Water Rock.png", "835 Yamper 8 Electric.png", "836 Boltund 8 Electric.png", "837 Rolycoly 8 Rock.png", "838 Carkol 8 Rock Fire.png", "839 Coalossal 8 Rock Fire.png", "839 Coalossal Gigantamax 8 Rock Fire.png", "840 Applin 8 Grass Dragon.png", "841 Flapple 8 Grass Dragon.png", "841 Flapple Gigantamax 8 Grass Dragon.png", "842 Appletun 8 Grass Dragon.png", "843 Silicobra 8 Ground.png", "844 Sandaconda 8 Ground.png", "844 Sandaconda Gigantamax 8 Ground.png", "845 Cramorant 8 Flying Water.png", "846 Arrokuda 8 Water.png", "847 Barraskewda 8 Water.png", "848 Toxel 8 Electric Poison.png", "849 Toxtricity Amped 8 Electric Poison.png", "849 Toxtricity Gigantamax 8 Electric Poison.png", "849 Toxtricity Low Key 8 Electric Poison.png", "850 Sizzlipede 8 Fire Bug.png", "851 Centiskorch 8 Fire Bug.png", "851 Centiskorch Gigantamax 8 Fire Bug.png", "852 Clobbopus 8 Fighting.png", "853 Grapploct 8 Fighting.png", "854 Sinistea 8 Ghost.png", "855 Polteageist 8 Ghost.png", "856 Hatenna 8 Psychic.png", "857 Hattrem 8 Psychic.png", "858 Hatterene 8 Psychic Fairy.png", "858 Hatterene Gigantamax 8 Psychic Fairy.png", "859 Impidimp 8 Dark Fairy.png", "860 Morgrem 8 Dark Fairy.png", "861 Grimmsnarl 8 Dark Fairy.png", "861 Grimmsnarl Gigantamax 8 Dark Fairy.png", "862 Obstagoon 8 Dark Normal.png", "863 Perrserker 8 Steel.png", "864 Cursola 8 Ghost.png", "865 Sirfetch'd 8 Fighting.png", "866 Mr. Rime 8 Ice Psychic.png", "867 Runerigus 8 Ground Ghost.png", "868 Milcery 8 Fairy.png", "869 Alcremie 8 Fairy.png", "869 Alcremie Gigantamax 8 Fairy.png", "870 Falinks 8 Fighting.png", "871 Pincurchin 8 Electric.png", "872 Snom 8 Ice Bug.png", "873 Frosmoth 8 Ice Bug.png", "874 Stonjourner 8 Rock.png", "875 Eiscue Ice Face 8 Ice.png", "875 Eiscue Noice Face 8 Ice.png", "876 Indeedee 8 Psychic Normal.png", "877 Morpeko Full Belly 8 Electric Dark.png", "877 Morpeko Hangry 8 Electric Dark.png", "878 Cufant 8 Steel.png", "879 Copperajah 8 Steel.png", "879 Copperajah Gigantamax 8 Steel.png", "880 Dracozolt 8 Electric Dragon.png", "881 Arctozolt 8 Electric Ice.png", "882 Dracovish 8 Water Dragon.png", "883 Arctovish 8 Water Ice.png", "884 Duraludon 8 Steel Dragon.png", "884 Duraludon Gigantamax 8 Steel Dragon.png", "885 Dreepy 8 Dragon Ghost.png", "886 Drakloak 8 Dragon Ghost.png", "887 Dragapult 8 Dragon Ghost.png", "888 Zacian Crowned Sword 8 Fairy Steel.png", "888 Zacian Hero of Many Battles 8 Fairy.png", "889 Zamazenta Crowned Shield 8 Fighting Steel.png", "889 Zamazenta Hero of Many Battles 8 Fighting.png", "890 Eternatus 8 Poison Dragon.png", "890 Eternatus Eternamax 8 Poison Dragon.png", "891 Kubfu 8 Fighting.png", "892 Urshifu Gigantamax Rapid Strike 8 Fighting Water.png", "892 Urshifu Gigantamax Single Strike 8 Fighting Dark.png", "892 Urshifu Rapid Strike 8 Fighting Water.png", "892 Urshifu Single Strike 8 Fighting Dark.png", "893 Zarude 8 Dark Grass.png", "894 Regieleki 8 Electric.png", "895 Regidrago 8 Dragon.png", "896 Glastrier 8 Ice.png", "897 Spectrier 8 Ghost.png", "898 Calyrex 8 Psychic Grass.png", "898 Calyrex Ice Rider 8 Psychic Ice.png", "898 Calyrex Shadow Rider 8 Psychic Dark.png", "899 Wyrdeer 8 Normal Psychic.png", "900 Kleavor 8 Bug Rock.png", "901 Ursaluna 8 Ground Normal.png", "901 Ursaluna Bloodmoon 9 Ground Normal.png", "902 Basculegion 8 Water Ghost.png", "903 Sneasler 8 Fighting Poison.png", "904 Overqwil 8 Dark Poison.png", "905 Enamorus Incarnate 8 Fairy Flying.png", "905 Enamorus Therian 8 Fairy Flying.png", "906 Sprigatito 9 Grass.png", "907 Floragato 9 Grass.png", "908 Meowscarada 9 Grass Dark.png", "909 Fuecoco 9 Fire.png", "910 Crocalor 9 Fire.png", "911 Skeledirge 9 Fire Ghost.png", "912 Quaxly 9 Water.png", "913 Quaxwell 9 Water.png", "914 Quaquaval 9 Water Fighting.png", "915 Lechonk 9 Normal.png", "916 Oinkologne 9 Normal.png", "917 Tarountula 9 Bug.png", "918 Spidops 9 Bug.png", "919 Nymble 9 Bug.png", "920 Lokix 9 Bug Dark.png", "921 Pawmi 9 Electric.png", "922 Pawmo 9 Electric Fighting.png", "923 Pawmot 9 Electric Fighting.png", "924 Tandemaus 9 Normal.png", "925 Maushold 9 Normal.png", "926 Fidough 9 Fairy.png", "927 Dachsbun 9 Fairy.png", "928 Smoliv 9 Grass Normal.png", "929 Dolliv 9 Grass Normal.png", "930 Arboliva 9 Grass Normal.png", "931 Squawkabilly 9 Normal Flying.png", "932 Nacli 9 Rock.png", "933 Naclstack 9 Rock.png", "934 Garganacl 9 Rock.png", "935 Charcadet 9 Fire.png", "936 Armarouge 9 Fire Psychic.png", "937 Ceruledge 9 Fire Ghost.png", "938 Tadbulb 9 Electric.png", "939 Bellibolt 9 Electric.png", "940 Wattrel 9 Electric Flying.png", "941 Kilowattrel 9 Electric Flying.png", "942 Maschiff 9 Dark.png", "943 Mabosstiff 9 Dark.png", "944 Shroodle 9 Poison Normal.png", "945 Grafaiai 9 Poison Normal.png", "946 Bramblin 9 Grass Ghost.png", "947 Brambleghast 9 Grass Ghost.png", "948 Toedscool 9 Ground Grass.png", "949 Toedscruel 9 Ground Grass.png", "950 Klawf 9 Rock.png", "951 Capsakid 9 Grass.png", "952 Scovillain 9 Grass Fire.png", "953 Rellor 9 Bug.png", "954 Rabsca 9 Bug Psychic.png", "955 Flittle 9 Psychic.png", "956 Espathra 9 Psychic.png", "957 Tinkatink 9 Fairy Steel.png", "958 Tinkatuff 9 Fairy Steel.png", "959 Tinkaton 9 Fairy Steel.png", "960 Wiglett 9 Water.png", "961 Wugtrio 9 Water.png", "962 Bombirdier 9 Flying Dark.png", "963 Finizen 9 Water.png", "964 Palafin Hero 9 Water.png", "964 Palafin Zero 9 Water.png", "965 Varoom 9 Steel Poison.png", "966 Revavroom 9 Steel Poison.png", "967 Cyclizar 9 Dragon Normal.png", "968 Orthworm 9 Steel.png", "969 Glimmet 9 Rock Poison.png", "970 Glimmora 9 Rock Poison.png", "971 Greavard 9 Ghost.png", "972 Houndstone 9 Ghost.png", "973 Flamigo 9 Flying Fighting.png", "974 Cetoddle 9 Ice.png", "975 Cetitan 9 Ice.png", "976 Veluza 9 Water Psychic.png", "977 Dondozo 9 Water.png", "978 Tatsugiri Curly 9 Dragon Water.png", "978 Tatsugiri Droopy 9 Dragon Water.png", "978 Tatsugiri Stretchy 9 Dragon Water.png", "979 Annihilape 9 Fighting Ghost.png", "980 Clodsire 9 Poison Ground.png", "981 Farigiraf 9 Normal Psychic.png", "982 Dudunsparce 9 Normal.png", "983 Kingambit 9 Dark Steel.png", "984 Great Tusk 9 Ground Fighting.png", "985 Scream Tail 9 Fairy Psychic.png", "986 Brute Bonnet 9 Grass Dark.png", "987 Flutter Mane 9 Ghost Fairy.png", "988 Slither Wing 9 Bug Fighting.png", "989 Sandy Shocks 9 Electric Ground.png", "990 Iron Treads 9 Ground Steel.png", "991 Iron Bundle 9 Ice Water.png", "992 Iron Hands 9 Fighting Electric.png", "993 Iron Jugulis 9 Dark Flying.png", "994 Iron Moth 9 Fire Poison.png", "995 Iron Thorns 9 Rock Electric.png", "996 Frigibax 9 Dragon Ice.png", "997 Arctibax 9 Dragon Ice.png", "998 Baxcalibur 9 Dragon Ice.png", "999 Gimmighoul Chest 9 Ghost.png", "999 Gimmighoul Roaming 9 Ghost.png", "1000 Gholdengo 9 Steel Ghost.png", "1001 Wo-Chien 9 Dark Grass.png", "1002 Chien-Pao 9 Dark Ice.png", "1003 Ting-Lu 9 Dark Ground.png", "1004 Chi-Yu 9 Dark Fire.png", "1005 Roaring Moon 9 Dragon Dark.png", "1006 Iron Valiant 9 Fairy Fighting.png", "1007 Koraidon 9 Fighting Dragon.png", "1008 Miraidon 9 Electric Dragon.png", "1009 Walking Wake 9 Water Dragon.png", "1010 Iron Leaves 9 Grass Psychic.png", "1011 Dipplin 9 Grass Dragon.png", "1012 Poltchageist 9 Grass Ghost.png", "1013 Sinistcha 9 Grass Ghost.png", "1014 Okidogi 9 Poison Fighting.png", "1015 Munkidori 9 Poison Psychic.png", "1016 Fezandipiti 9 Poison Fairy.png", "1017 Ogerpon Cornerstone Mask 9 Grass Rock.png", "1017 Ogerpon Hearthflame Mask 9 Grass Fire.png.png", "1017 Ogerpon Teal Mask 9 Grass.png", "1017 Ogerpon Wellspring Mask 9 Grass Water.png.png", "1018 Archaludon 9 Steel Dragon.png", "1019 Hydrapple 9 Grass Dragon.png", "1020 Gouging Fire 9 Fire Dragon.png", "1021 Raging Bolt 9 Electric Dragon.png", "1022 Iron Boulder 9 Rock Psychic.png", "1023 Iron Crown 9 Steel Psychic.png", "1024 Terapagos 9 Normal.png", "1024 Terapagos Stellar 9 Normal.png", "1024 Terapagos Terastal 9 Normal.png", "1025 Pecharunt 9 Poison Ghost.png"];


// Get a list of selected generations
function getSelectedGenerations() {
    let selectedGens = [];
    for (let i = 1; i <= 9; i++) {
        if (document.getElementById('gen' + i).checked) {
            selectedGens.push(i);
        }
    }
    return selectedGens;
}


let recentPokemons = [];
const MAX_RECENT_POKEMON = 50; // How many pokemon until repeat allowed

function updateRecentPokemons(newImage) {
    recentPokemons.push(newImage);
    if (recentPokemons.length > MAX_RECENT_POKEMON) {
        recentPokemons.shift();
    }
}

let currentPokemon = {};
let isGuessChecked = false;

// Randomize the pokemon from the pool of possible picks
function loadRandomPokemon() {
    let selectedGens = getSelectedGenerations();
    // Filter so pokemon is only chosen from selected gens
    let filteredImages = pokemonImages.filter(img => {
        let regExp = / (\d) /;
        let match = img.match(regExp);
        let genNumber = match ? parseInt(match[1], 10) : null;
        return genNumber && selectedGens.includes(genNumber);
    });
    filteredImages = filteredImages.filter(img => !recentPokemons.includes(img));

    if (filteredImages.length === 0) {
        alert("Please select at least one generation.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredImages.length);
    const imageName = filteredImages[randomIndex];
    currentPokemon.imageUrl = 'img/' + encodeURIComponent(imageName);

    // Update the recent Pokémons array
    updateRecentPokemons(imageName);

    // Extract details from imageName
    // Example: '006 Charizard Mega X 6 Fire Dragon'
    const details = imageName.split(' ');
    //Checking if there are one or two types
    const isGenSecondLast = details[details.length - 2].length === 1; 
    currentPokemon.dexNumber = details[0];
    currentPokemon.gen = isGenSecondLast ? details[details.length - 2] : details[details.length - 3];
    currentPokemon.type1 = isGenSecondLast ? details[details.length - 1].split('.')[0] : details[details.length - 2]; // Remove file extension if it's the last element
    currentPokemon.type2 = isGenSecondLast ? '' : details[details.length - 1].split('.')[0];

    // Lastly extract name and potential form
    const nameEndIndex = isGenSecondLast ? details.length - 2 : details.length - 3;
    const specialFirstWords = ['Mr.', 'Mime', 'Tapu', 'Roaring', 'Iron', 'Walking', 'Great', 'Scream', 'Brute', 'Flutter', 'Slither', 'Sandy', 'Raging', 'Gouging', 'Type'];
    let nameWords = details.slice(1, nameEndIndex).join(' ').split(' ');

    if (specialFirstWords.includes(nameWords[0]) && nameWords.length > 1) {
        // For special cases, use the first two words as the name
        currentPokemon.name = nameWords.slice(0, 2).join(' ');
        currentPokemon.form = nameWords.slice(2).join(' ');
    } else {
        // Otherwise, use the first word as the name
        currentPokemon.name = nameWords[0];
        currentPokemon.form = nameWords.slice(1).join(' ');
    }

    // Special case pokemon where the name cannot properly be stored in filename
    if (currentPokemon.name === "Type Null") {
        currentPokemon.name = "Type: Null"
    }

    // Display image and update submit button text
    document.getElementById('pokemon-image').src = currentPokemon.imageUrl;
    document.getElementById('submit-btn').innerText = 'Submit Guess';
    isGuessChecked = false;
}

let scoreSum = 0;
let numOfScores = 0;
let currStreak = 0;
let maxStreak = 0;

// Update the info of the pokemon upon guessing
function updateInfoCard() {
    document.getElementById('info-dex').textContent = currentPokemon.dexNumber;
    document.getElementById('info-name').textContent = currentPokemon.name;
    if (currentPokemon.form){
        document.getElementById('info-form').textContent =" " + currentPokemon.form;
    }
    document.getElementById('info-gen').textContent = currentPokemon.gen;
    document.getElementById('info-type1').textContent = currentPokemon.type1;
    if (currentPokemon.type2) {
        document.getElementById('typeslash').textContent = " / ";
        document.getElementById('info-type2').textContent = currentPokemon.type2;
    }
    let accuracy = (scoreSum / numOfScores).toFixed(1); // Fix to one decimal place first
    document.getElementById('accuracy').textContent = parseFloat(accuracy); // Parse as float to remove trailing .0
    document.getElementById('total-pokemon').textContent = numOfScores;
    document.getElementById('current-streak').textContent = currStreak;
    document.getElementById('max-streak').textContent = maxStreak;

}

// Display the feedback from the guess by changing text color
function updateGuessResults(nameCorrect, formCorrect, genCorrect, type1Correct, type2Correct, type1Partial = false, type2Partial = false ) {
    document.getElementById('info-name').className = nameCorrect ? 'correct' : 'incorrect';
    document.getElementById('info-form').className = formCorrect ? 'correct' : 'incorrect';
    document.getElementById('info-gen').className = genCorrect ? 'correct' : 'incorrect';
    document.getElementById('info-type1').className = type1Correct ? 'correct' : 'incorrect';
    document.getElementById('info-type2').className = type2Correct ? 'correct' : 'incorrect';
    if (type1Partial){
        document.getElementById('info-type1').className = 'partial';
    } 
    if (type2Partial) {
        document.getElementById('info-type2').className = 'partial';
    } 
}

function resetStats(){
    document.getElementById('accuracy').textContent = '0';
    document.getElementById('total-pokemon').textContent = '0';
    document.getElementById('current-streak').textContent = '0';
    document.getElementById('max-streak').textContent = '0';
    scoreSum = 0;
    numOfScores = 0;
    currStreak = 0;
    maxStreak = 0;
}

function resetInfoCard(){
    document.getElementById('info-dex').className = 'neutral';
    document.getElementById('info-name').className = 'neutral';
    document.getElementById('info-form').className = 'neutral';
    document.getElementById('info-gen').className = 'neutral';
    document.getElementById('info-type1').className = 'neutral';
    document.getElementById('info-type2').className = 'neutral';
    document.getElementById('info-dex').textContent = "???";
    document.getElementById('info-name').textContent = "???"
    document.getElementById('info-form').textContent = ""
    document.getElementById('info-gen').textContent = "?"
    document.getElementById('info-type1').textContent = "???"
    document.getElementById('info-type2').textContent = ""
    document.getElementById('typeslash').textContent = "";
}

const formVariations = {
    "rainy": ["rain"],
    "sunny": ["sun"],
    "snowy": ["snow"],
    "sandy": ["sand"],
    "sunshine": ["sun","sunny"],
    "alola": ["alolan"],
    "galar": ["galarian"],
    "paldea": ["paldean"],
    "hisui": ["hisuian"],
    "defense": ["defence"],
    "attack": ["offence","offense"],
    "pom-pom": ["pompom"],
    "pa'u": ["pau"],
    "gigantamax": ["gmax", "g-max", "giga"],
    "eternamax": ["emax", "e-max"],
    "10%": ["10"],
    "50%": ["50", ""],
    "complete": ["100", "100%"],
    "roaming": ["roam"],
    "ash-greninja": ["ash"],
    "pirouette": ["piruette", "piroette"],
    "mask": [""],
    "confined": [""],
    "altered": [""],
    "incarnate": [""],
    "land": [""],
    "aria": [""],
    "midday": [""],
    "solo": [""],
    "meteor": [""],
    "belly": [""],
    "full": [""],
    "hero": [""],
    "of": [""],
    "many": [""],
    "battles": [""],
    "sword": [""],
    "shield": [""],
    "strike": [""],
    "rider": [""],
    "red": [""],
    "blue": [""],
    "white": [""],
    "face": [""],
    "chest": [""],
    "cloak": [""]
};

// These are form names for 'default' forms, the player can omit typing them and still score full
const optionalFormWords = ["50%","mask","confined", "altered", "incarnate", "land", "aria", "midday", "solo", "meteor", "belly", "full", "hero", "of", "many", "battles", "sword", "shield", "strike", "rider", "red", "blue", "white", "chest", "face", "cloak"];

const nameVariations = {
    "nidoran\u2640": ["nidoran", "nidoranf"],
    "nidoran\u2642": ["nidoran", "nidoranm"],
    "farfetch'd": ["farfetchd"],
    "sirfetch'd": ["sirfetchd"],
    "flab\u00e9b\u00e9": ["flabebe"],
    "ho-oh": ["hooh"],
    "mr. mime": ["mr mime", "mrmime", "mr.mime"],
    "mime jr.": ["mime jr", "mimejr", "mimejr."],
    "porygon-z": ["porygonz"],
    "jangmo-o": ["jangmoo"],
    "hakamo-o": ["hakamoo"],
    "kommo-o": ["kommoo"],
    "tapu koko": ["tapukoko"],
    "tapu lele": ["tapulele"],
    "tapu bulu": ["tapubulu"],
    "tapu fini": ["tapufini"],
    "mr. rime": ["mr rime", "mrrime", "mr.rime"],
    "wo-chien": ["wochien"],
    "chien-pao": ["chienpao"],
    "ting-lu": ["tinglu"],
    "chi-yu": ["chiyu"],
    "type: null": ["type null", "type:null", "typenull"]
};

// Function for the guess / next pokemon button
function checkAnswer() {

    let currentScore = 0;
    
    if (!isGuessChecked) {

        // Retrieve the player's guess
        const nameFormGuess = document.getElementById('pokemon-name').value.split(' ');
        const genGuess = document.getElementById('pokemon-gen').value;
        const type1Guess = document.getElementById('pokemon-type1').value;
        const type2Guess = document.getElementById('pokemon-type2').value;

        const specialFirstWords = ['mr.', 'mr', 'mime', 'tapu', 'roaring', 'iron', 'walking', 'great', 'scream', 'brute', 'flutter', 'slither', 'sandy', 'raging', 'gouging', 'type', 'type:', 'ash'];

        let nameGuess;
        let formGuessWords;
        let formMatch;
        let nameMatch;


        // Check if the first word of the guess is in the list of special cases
        if (specialFirstWords.includes(nameFormGuess[0].toLowerCase()) && nameFormGuess.length > 1) {
            nameGuess = nameFormGuess.slice(0, 2).join(' '); // First two words are the name
            formGuessWords = nameFormGuess.slice(2).map(word => word.toLowerCase()); // Rest is the form
        } else {
            nameGuess = nameFormGuess[0]; // First word is the name
            formGuessWords = nameFormGuess.slice(1).map(word => word.toLowerCase()); // Rest is the form
        }
        
        // Special case where form name could be easily mixed up with the pokemon name
        if (currentPokemon.form === "Ash-Greninja" && (nameGuess.toLowerCase() === "ash greninja" || nameGuess.toLowerCase() === "ash-greninja")){
            nameMatch = true;
            formMatch = true;
        } 
        // Default case
        else {
            
            nameMatch = (nameGuess.toLowerCase() === currentPokemon.name.toLowerCase()) || (nameVariations[currentPokemon.name.toLowerCase()] && nameVariations[currentPokemon.name.toLowerCase()].includes(nameGuess.toLowerCase()));

            let actualFormWords;
            // Checking that the player submitted all required form words, or their possible variation spellings in some order
            if (currentPokemon.form){
                actualFormWords = currentPokemon.form.toLowerCase().split(' ');
    
                let expandedFormWords = [...actualFormWords];
                actualFormWords.forEach(word => {
                    if (formVariations[word]) {
                        expandedFormWords.push(...formVariations[word].map(variant => variant.toLowerCase()));
                    }
                });
                formMatch = formGuessWords.every(guessWord => expandedFormWords.includes(guessWord) || ((nameMatch || actualFormWords.length > 1) && optionalFormWords.includes(guessWord))) && 
                                actualFormWords.every(actualWord => formGuessWords.includes(actualWord) || (formVariations[actualWord] && formVariations[actualWord].some(variant => formGuessWords.includes(variant.toLowerCase()))) || ((nameMatch || actualFormWords.length > 1) && optionalFormWords.includes(actualWord)));
            }
        }
        
        let genMatch = genGuess === currentPokemon.gen;
        let type1Match = type1Guess === currentPokemon.type1;
        let type2Match = type2Guess === currentPokemon.type2;


        // Scoring logic 
        const nameFormCombinedScore = 50;
        const formScore = 20;
        const genScore = 20;
        const typeScore = 30;
        const typePenalty = 5;
        if (currentPokemon.form){
            currentScore += (nameMatch ? nameFormCombinedScore-formScore : 0) + (formMatch ? formScore : 0);
        } else {
            currentScore += nameMatch ? nameFormCombinedScore : 0;
        }

        let type1Partial = false;
        let type2Partial = false;
        if ((type1Guess === currentPokemon.type2 && type2Guess === currentPokemon.type1) ){
            currentScore += (typeScore-typePenalty);
            type1Partial = true;
            type2Partial = true;
        } else if (!currentPokemon.type2 && !type2Match && type1Match){
            currentScore += (typeScore-2*typePenalty);
            type1Partial = true;
        } else if (currentPokemon.type2 && type1Guess === currentPokemon.type2){
            currentScore += (typeScore-3*typePenalty);
            type2Partial = true;
        } else if (type2Guess === currentPokemon.type1){
            currentScore += (typeScore-3*typePenalty);
            type1Partial = true;
        } else if (currentPokemon.type2){
            currentScore += (type1Match ? typeScore/2 : 0) + (type2Match ? typeScore/2 : 0);
        } else {
            currentScore += type1Match ? typeScore : 0;
        }
        currentScore += genMatch ? genScore : 0;

        scoreSum += currentScore;
        numOfScores++;

        // Combo logic
        const streakTreshold = 75;
        if (currentScore >= streakTreshold){
            currStreak++;
            maxStreak = Math.max(maxStreak,currStreak);
        } else currStreak = 0;

        // Sound effect logic
        if (currentScore === 100){
            playSound('sound-perfect');
        } else if (currentScore >= 75){
            playSound('sound-great');
        } else if (currentScore >= 35){
            playSound('sound-ok');
        } else {
            playSound('sound-bad');
        }

        updateGuessResults(nameMatch, formMatch, genMatch, type1Match, type2Match, type1Partial, type2Partial);
        updateInfoCard();

        document.getElementById('submit-btn').innerText = 'Next Pokémon';
        isGuessChecked = true;
    }
    else {
        
        // Reset the guess form
        document.getElementById('pokemon-name').value = '';
        let selectedGens = getSelectedGenerations();
        document.getElementById('pokemon-gen').selectedIndex = selectedGens[0]-1; 
        document.getElementById('pokemon-type1').selectedIndex = 0;
        document.getElementById('pokemon-type2').selectedIndex = 0;
        resetInfoCard();
        // Load the next Pokémon
        loadRandomPokemon();
    }
}

function playSound(soundID){
    var sound = document.getElementById(soundID);
    sound.play();
}

document.addEventListener('DOMContentLoaded', function() {

    // Array of element IDs in the order to navigate through
    const focusableElements = [
        'pokemon-name',
        'pokemon-gen',
        'pokemon-type1',
        'pokemon-type2',
        'submit-btn'
    ];
    
    let shouldMoveFocus = true;
    const nameInput = document.getElementById('pokemon-name');

    document.addEventListener('keydown', function(event) {

        // Enter always submits guess or loads next pokemon
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswer();
            document.getElementById('pokemon-name').focus();
        }

        // Left and right jump between form elements
        const currentFocusIndex = focusableElements.indexOf(document.activeElement.id);
        if (shouldMoveFocus && event.key === 'ArrowRight' && !(document.activeElement.id === "pokemon-name")) {
            event.preventDefault();
            // Move focus to the next element or loop back to the start
            const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
            // If moving to name input field, move text cursor to right
            document.getElementById(focusableElements[nextIndex]).focus();
            if (document.activeElement.id === "pokemon-name"){
                nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
            }
        } else if (shouldMoveFocus && event.key === 'ArrowLeft' && !(document.activeElement.id === "pokemon-name")) {
            event.preventDefault();
            // Move focus to the previous element or loop back to the end
            const prevIndex = (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length;
            // If moving to name input field, move text cursor to right
            document.getElementById(focusableElements[prevIndex]).focus();
            if (document.activeElement.id === "pokemon-name"){
                nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
            }
        }
        shouldMoveFocus = true;
    });
    
    // Pressing left and right in the name field default behavior if there are letters to that direction of the cursor, otherwise jump to another item
    nameInput.addEventListener('keydown', function(event) {
        const cursorPosition = nameInput.selectionStart;
        const hasTextToLeft = cursorPosition > 0;
        const hasTextToRight = cursorPosition < nameInput.value.length;

        if (event.key === 'ArrowRight' && !hasTextToRight) {
            event.preventDefault();
            document.getElementById('pokemon-gen').focus();
            shouldMoveFocus = false;
        } else if (event.key === 'ArrowLeft' && !hasTextToLeft) {
            event.preventDefault();
            document.getElementById('submit-btn').focus();
            shouldMoveFocus = false;
        }
    });

    document.getElementById('pokemon-gen').addEventListener('keydown', function(event) {
        // Check if the key pressed is a number from 1 to 9
        if (event.key >= '1' && event.key <= '9') {
            event.preventDefault();
            // Convert the key to a zero-based index for the dropdown
            const genIndex = parseInt(event.key, 10) - 1;
            this.selectedIndex = genIndex;
        }
    });
    
    // Initialize with first pokemon
    loadRandomPokemon();
});