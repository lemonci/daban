import { Aaron, AaronFront, AaronBack } from './aaron.mjs'
import { Albert, AlbertFront } from './albert.mjs'
import { Ashley, AshleyFront, AshleyBack } from './ashley.mjs'
import { Bee, BeeFront } from './bee.mjs'
import { Bella, BellaFront, BellaBack } from './bella.mjs'
import { Benjamin, BenjaminFront } from './benjamin.mjs'
import { Bent, BentFront, BentBack } from './bent.mjs'
import { Bibi, BibiFront, BibiBack } from './bibi.mjs'
import { Bob, BobFront, BobBack } from './bob.mjs'
import { Breanna, BreannaFront, BreannaBack } from './breanna.mjs'
import { Brian, BrianFront, BrianBack } from './brian.mjs'
import { Bruce, BruceFront, BruceBack } from './bruce.mjs'
import { Carlita, CarlitaFront, CarlitaBack } from './carlita.mjs'
import { Carlton, CarltonFront, CarltonBack } from './carlton.mjs'
import { Cathrin, CathrinFront, CathrinBack } from './cathrin.mjs'
import { Charlie, CharlieFront, CharlieBack } from './charlie.mjs'
import { Cornelius, CorneliusFront, CorneliusBack } from './cornelius.mjs'
import { Crux, CruxFront /*, CruxBack*/ } from './crux.mjs'
import { Devon, DevonFront /*, DevonBack*/ } from './devon.mjs'
import { Diana, DianaFront, DianaBack } from './diana.mjs'
import { Florence, FlorenceFront } from './florence.mjs'
import { Florent, FlorentFront } from './florent.mjs'
import { Gozer, GozerFront, GozerBack } from './gozer.mjs'
import { Hi, HiFront } from './hi.mjs'
import { Holmes, HolmesFront } from './holmes.mjs'
import { Hortensia, HortensiaFront } from './hortensia.mjs'
import { Huey, HueyFront, HueyBack } from './huey.mjs'
import { Hugo, HugoFront, HugoBack } from './hugo.mjs'
import { Jane, JaneFront, JaneBack } from './jane.mjs'
import { Jett, JettFront, JettBack } from './jett.mjs'
import { Lucy, LucyFront } from './lucy.mjs'
import { Lumina, LuminaFront, LuminaBack } from './lumina.mjs'
import { Lumira, LumiraFront, LumiraBack } from './lumira.mjs'
import { Lunetius, LunetiusFront } from './lunetius.mjs'
import { Percy, PercyFront } from './percy.mjs'
import { Polly, PollyFront } from './polly.mjs'
import { Noble, NobleFront, NobleBack } from './noble.mjs'
import { Octoplushy, OctoplushyFront /*, OctoplushyBack*/ } from './octoplushy.mjs'
import { Otis, OtisFront /*, OtisBack*/ } from './otis.mjs'
import { Onyx, OnyxFront } from './onyx.mjs'
import { Penelope, PenelopeFront /*, PenelopeBack*/ } from './penelope.mjs'
import { Sabrina, SabrinaFront, SabrinaBack } from './sabrina.mjs'
import { Sandy, SandyFront } from './sandy.mjs'
import { Sarah, SarahFront, SarahBack } from './sarah.mjs'
import { Shelly, ShellyFront } from './shelly.mjs'
import { Simon, SimonFront, SimonBack } from './simon.mjs'
import { Shin, ShinFront } from './shin.mjs'
import { Skully, SkullyFront /*, SkullyBack*/ } from './skully.mjs'
import { Sophie, SophieFront, SophieBack } from './sophie.mjs'
import { Sven, SvenFront } from './sven.mjs'
import { Teagan, TeaganFront, TeaganBack } from './teagan.mjs'
import { Tina, TinaFront, TinaBack } from './tina.mjs'
import { Titan, TitanFront } from './titan.mjs'
import { Toni, ToniFront, ToniBack } from './toni.mjs'
import { Trayvon, TrayvonFront } from './trayvon.mjs'
import { Tristan, TristanFront, TristanBack } from './tristan.mjs'
import { Uma, UmaFront, UmaBack } from './uma.mjs'
import { Umbra, UmbraFront, UmbraBack } from './umbra.mjs'
import { Wahid, WahidFront, WahidBack } from './wahid.mjs'
import { Waralee, WaraleeFront /*, WaraleeBack*/ } from './waralee.mjs'
import { Yuri, YuriFront, YuriBack } from './yuri.mjs'

/**
 * An object where the key is the design name and the value the front LineDrawing component
 *
 * @constant
 * @public
 */
export const lineDrawingsFront = {
  aaron: AaronFront,
  albert: AlbertFront,
  ashley: AshleyFront,
  bee: BeeFront,
  bella: BellaFront,
  benjamin: BenjaminFront,
  bent: BentFront,
  bibi: BibiFront,
  bob: BobFront,
  breanna: BreannaFront,
  brian: BrianFront,
  bruce: BruceFront,
  carlita: CarlitaFront,
  carlton: CarltonFront,
  cathrin: CathrinFront,
  charlie: CharlieFront,
  cornelius: CorneliusFront,
  crux: CruxFront,
  devon: DevonFront,
  diana: DianaFront,
  florence: FlorenceFront,
  florent: FlorentFront,
  gozer: GozerFront,
  hi: HiFront,
  holmes: HolmesFront,
  hortensia: HortensiaFront,
  huey: HueyFront,
  hugo: HugoFront,
  jane: JaneFront,
  jett: JettFront,
  lucy: LucyFront,
  lumina: LuminaFront,
  lumira: LumiraFront,
  lunetius: LunetiusFront,
  percy: PercyFront,
  polly: PollyFront,
  noble: NobleFront,
  octoplushy: OctoplushyFront,
  onyx: OnyxFront,
  otis: OtisFront,
  penelope: PenelopeFront,
  percy: PercyFront,
  sabrina: SabrinaFront,
  sandy: SandyFront,
  sarah: SarahFront,
  shelly: ShellyFront,
  shin: ShinFront,
  simon: SimonFront,
  skully: SkullyFront,
  sven: SvenFront,
  sophie: SophieFront,
  teagan: TeaganFront,
  tina: TinaFront,
  titan: TitanFront,
  toni: ToniFront,
  trayvon: TrayvonFront,
  tristan: TristanFront,
  uma: UmaFront,
  umbra: UmbraFront,
  wahid: WahidFront,
  waralee: WaraleeFront,
  yuri: YuriFront,
}

/**
 * An object where the key is the design name and the value the back LineDrawing component
 *
 * @constant
 * @public
 */
export const lineDrawingsBack = {
  aaron: AaronBack,
  ashley: AshleyBack,
  bella: BellaBack,
  bent: BentBack,
  bibi: BibiBack,
  bob: BobBack,
  breanna: BreannaBack,
  brian: BrianBack,
  bruce: BruceBack,
  carlita: CarlitaBack,
  carlton: CarltonBack,
  cathrin: CathrinBack,
  charlie: CharlieBack,
  cornelius: CorneliusBack,
  /*crux: CruxBack,*/
  /*devon: DevonBack,*/
  diana: DianaBack,
  gozer: GozerBack,
  huey: HueyBack,
  hugo: HugoBack,
  jane: JaneBack,
  jett: JettBack,
  lumina: LuminaBack,
  lumira: LumiraBack,
  noble: NobleBack,
  /*octoplushy: OctoplushyBack,*/
  /*otis: OtisBack,*/
  /*penelope: PenelopeBack,*/
  sabrina: SabrinaBack,
  sarah: SarahBack,
  simon: SimonBack,
  /* skully: SkullyBack, */
  sophie: SophieBack,
  teagan: TeaganBack,
  tina: TinaBack,
  toni: ToniBack,
  tristan: TristanBack,
  uma: UmaBack,
  umbra: UmbraBack,
  wahid: WahidBack,
  /*waralee: WaraleeBack,*/
  yuri: YuriBack,
}

/**
 * An object where the key is the design name and the value the full LineDrawing component
 *
 * @constant
 * @public
 */
export const lineDrawings = {
  aaron: Aaron,
  albert: Albert,
  ashley: Ashley,
  bee: Bee,
  bella: Bella,
  benjamin: Benjamin,
  bent: Bent,
  bibi: Bibi,
  bob: Bob,
  breanna: Breanna,
  brian: Brian,
  bruce: Bruce,
  carlita: Carlita,
  carlton: Carlton,
  cathrin: Cathrin,
  charlie: Charlie,
  cornelius: Cornelius,
  crux: Crux,
  devon: Devon,
  diana: Diana,
  florence: Florence,
  florent: Florent,
  gozer: Gozer,
  hi: Hi,
  holmes: Holmes,
  hortensia: Hortensia,
  huey: Huey,
  hugo: Hugo,
  jane: Jane,
  jett: Jett,
  lucy: Lucy,
  lumina: Lumina,
  lumira: Lumira,
  lunetius: Lunetius,
  percy: Percy,
  polly: Polly,
  noble: Noble,
  octoplushy: Octoplushy,
  onyx: Onyx,
  otis: Otis,
  penelope: Penelope,
  sarah: Sarah,
  shin: Shin,
  sabrina: Sabrina,
  sandy: Sandy,
  shelly: Shelly,
  skully: Skully,
  simon: Simon,
  sophie: Sophie,
  sven: Sven,
  teagan: Teagan,
  tina: Tina,
  titan: Titan,
  toni: Toni,
  trayvon: Trayvon,
  tristan: Tristan,
  uma: Uma,
  umbra: Umbra,
  wahid: Wahid,
  waralee: Waralee,
  yuri: Yuri,
}

/*
 * Named exports
 */
export {
  // Aaron
  Aaron,
  AaronFront,
  AaronBack,
  // Albert
  Albert,
  AlbertFront,
  //Ashley
  Ashley,
  AshleyFront,
  // Bee
  Bee,
  BeeFront,
  // Bella
  Bella,
  BellaFront,
  BellaBack,
  // Benjamin
  Benjamin,
  BenjaminFront,
  // Bent
  Bent,
  BentFront,
  BentBack,
  // Bibi
  Bibi,
  BibiFront,
  BibiBack,
  // Bob
  Bob,
  BobFront,
  BobBack,
  // Breanna
  Breanna,
  BreannaFront,
  BreannaBack,
  // Brian
  Brian,
  BrianFront,
  BrianBack,
  // Bruce
  Bruce,
  BruceFront,
  BruceBack,
  // Carlita
  Carlita,
  CarlitaFront,
  CarlitaBack,
  // Carlton
  Carlton,
  CarltonFront,
  CarltonBack,
  // Cathrin
  Cathrin,
  CathrinFront,
  CathrinBack,
  // Charlie
  Charlie,
  CharlieFront,
  CharlieBack,
  // Cornelius
  Cornelius,
  CorneliusFront,
  CorneliusBack,
  // Crux
  Crux,
  CruxFront,
  /*CruxBack,*/
  // Devon
  Devon,
  DevonFront,
  /*DevonBack,*/
  // Diana
  Diana,
  DianaFront,
  DianaBack,
  // Florence
  Florence,
  FlorenceFront,
  // Florent
  Florent,
  FlorentFront,
  // Gozer
  Gozer,
  GozerFront,
  GozerBack,
  // Hi
  Hi,
  HiFront,
  // Holmes
  Holmes,
  HolmesFront,
  // Hortensia
  Hortensia,
  HortensiaFront,
  // Huey
  Huey,
  HueyFront,
  HueyBack,
  // Hugo
  Hugo,
  HugoFront,
  HugoBack,
  // Jane
  Jane,
  JaneFront,
  JaneBack,
  // Jett
  Jett,
  JettFront,
  JettBack,
  // Lucy
  Lucy,
  LucyFront,
  // Lumina
  Lumina,
  LuminaFront,
  LuminaBack,
  // Lumira
  Lumira,
  LumiraFront,
  LumiraBack,
  // Lunetius
  Lunetius,
  LunetiusFront,
  // Percy
  Percy,
  PercyFront,
  // Polly
  Polly,
  PollyFront,
  // Noble
  Noble,
  NobleFront,
  NobleBack,
  // Octoplushy
  Octoplushy,
  OctoplushyFront,
  /*OctoplushyBack,*/
  //Onyx
  Onyx,
  OnyxFront,
  // Otis
  Otis,
  OtisFront,
  /*OtisBack,*/
  // Penelope
  Penelope,
  PenelopeFront,
  /*PenelopeBack,*/
  //Sandy
  Sandy,
  SandyFront,
  // Sarah
  Sarah,
  SarahFront,
  SarahBack,
  //Shelly
  Shelly,
  ShellyFront,
  //Shin
  Shin,
  ShinFront,
  // Simon
  Simon,
  SimonFront,
  SimonBack,
  // Sophie
  Sophie,
  SophieFront,
  SophieBack,
  // Skully
  Skully,
  SkullyFront,
  // SkullyBack,
  //Sven
  Sven,
  SvenFront,
  // Teagan
  Teagan,
  TeaganFront,
  TeaganBack,
  // Tina
  Tina,
  TinaFront,
  TinaBack,
  //Titan
  Titan,
  TitanFront,
  // Toni,
  Toni,
  ToniFront,
  ToniBack,
  //Trayvon
  Trayvon,
  TrayvonFront,
  // Tristan
  Tristan,
  TristanFront,
  TristanBack,
  // Uma
  Uma,
  UmaFront,
  UmaBack,
  // Umbra
  Umbra,
  UmbraFront,
  UmbraBack,
  // Wahid
  Wahid,
  WahidFront,
  WahidBack,
  // Waralee
  Waralee,
  WaraleeFront,
  /*WaraleeBack,*/
  //Yuri
  Yuri,
  YuriFront,
  YuriBack,
}
