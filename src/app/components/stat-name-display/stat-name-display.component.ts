import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Stat } from '../../../interfaces';

@Component({
  selector: 'app-stat-name-display',
  templateUrl: './stat-name-display.component.html',
  styleUrls: ['./stat-name-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatNameDisplayComponent implements OnInit {

  @Input() stat!: string;

  public statText = '';
  public statTooltip = '';

  public readonly statNames: Record<Stat, string> = {
    ['health' as Stat]: 'Health',
    ['energy' as Stat]: 'Energy',

    [Stat.PickaxePower]: 'Pickaxe Power',
    [Stat.AxePower]: 'Axe Power',
    [Stat.FishingPower]: 'Fishing Power',
    [Stat.ScythePower]: 'Scythe Power',
    [Stat.HuntingPower]: 'Hunting Power',

    [Stat.PickaxePowerPercent]: 'Pickaxe Power%',
    [Stat.AxePowerPercent]: 'Axe Power%',
    [Stat.FishingPowerPercent]: 'Fishing Power%',
    [Stat.ScythePowerPercent]: 'Scythe Power%',
    [Stat.HuntingPowerPercent]: 'Hunting Power%',

    [Stat.PickaxeSpeed]: 'Pickaxe Speed',
    [Stat.AxeSpeed]: 'Axe Speed',
    [Stat.FishingSpeed]: 'Fishing Speed',
    [Stat.ScytheSpeed]: 'Scythe Speed',
    [Stat.HuntingSpeed]: 'Hunting Speed',

    [Stat.PickaxeSpeedPercent]: 'Pickaxe Speed%',
    [Stat.AxeSpeedPercent]: 'Axe Speed%',
    [Stat.FishingSpeedPercent]: 'Fishing Speed%',
    [Stat.ScytheSpeedPercent]: 'Scythe Speed%',
    [Stat.HuntingSpeedPercent]: 'Hunting Speed%',

    [Stat.Armor]: 'Armor',
    [Stat.Mitigation]: 'Mitigation',
    [Stat.Healing]: 'Healing',
    [Stat.EnergyHealing]: 'Energy Healing',
    [Stat.Attack]: 'Attack',
    [Stat.EnergyBonus]: 'Energy',
    [Stat.HealthBonus]: 'Health',
    [Stat.Speed]: 'Speed',

    [Stat.HealingPerRound]: 'Health Restored Per Round',
    [Stat.HealingPerCombat]: 'Health Restored Per Encounter',
    [Stat.EnergyPerRound]: 'Energy Restored Per Round',
    [Stat.EnergyPerCombat]: 'Energy Restored Per Encounter'
  } as const;

  public readonly tooltips: Record<Stat, string> = {
    ['health' as Stat]: 'Your total health',
    ['energy' as Stat]: 'Your total energy',

    [Stat.PickaxePower]: 'Mining nodes will take less time (in seconds) to complete',
    [Stat.AxePower]: 'Logging nodes will take less time (in seconds) to complete',
    [Stat.FishingPower]: 'Fishing nodes will take less time (in seconds) to complete',
    [Stat.ScythePower]: 'Harvesting nodes will take less time (in seconds) to complete',
    [Stat.HuntingPower]: 'Hunting nodes will take less time (in seconds) to complete',

    [Stat.PickaxePowerPercent]: 'Mining nodes will take less time (by this percent) to complete',
    [Stat.AxePowerPercent]: 'Logging nodes will take less time (by this percent) to complete',
    [Stat.FishingPowerPercent]: 'Fishing nodes will take less time (by this percent) to complete',
    [Stat.ScythePowerPercent]: 'Harvesting nodes will take less time (by this percent) to complete',
    [Stat.HuntingPowerPercent]: 'Hunting nodes will take less time (by this percent) to complete',

    [Stat.PickaxeSpeed]: 'Mining nodes will cool down faster (in seconds)',
    [Stat.AxeSpeed]: 'Logging nodes will cool down faster (in seconds)',
    [Stat.FishingSpeed]: 'Fishing nodes will cool down faster (in seconds)',
    [Stat.ScytheSpeed]: 'Harvesting nodes will cool down faster (in seconds)',
    [Stat.HuntingSpeed]: 'Hunting nodes will cool down faster (in seconds)',

    [Stat.PickaxeSpeedPercent]: 'Mining nodes will cool down faster (by this percent)',
    [Stat.AxeSpeedPercent]: 'Logging nodes will cool down faster (by this percent)',
    [Stat.FishingSpeedPercent]: 'Fishing nodes will cool down faster (by this percent)',
    [Stat.ScytheSpeedPercent]: 'Harvesting nodes will cool down faster (by this percent)',
    [Stat.HuntingSpeedPercent]: 'Hunting nodes will cool down faster (by this percent)',

    [Stat.Armor]: 'Damage reduction (by this value)',
    [Stat.Mitigation]: 'Damage reduction (by this percent)',
    [Stat.Healing]: 'Healing skills are boosted (by this value)',
    [Stat.EnergyHealing]: 'Energy healing are boosted (by the value)',
    [Stat.Attack]: 'Outgoing damage is increased (by this value)',
    [Stat.EnergyBonus]: 'Bonus energy',
    [Stat.HealthBonus]: 'Bonus health',
    [Stat.Speed]: 'How fast you act in combat relative to other participants',

    [Stat.HealingPerRound]: 'Healing per combat round',
    [Stat.HealingPerCombat]: 'Healing when you enter combat',
    [Stat.EnergyPerRound]: 'Energy restored per combat round',
    [Stat.EnergyPerCombat]: 'Energy restored when you enter combat'
  } as const;

  constructor() { }

  ngOnInit() {
    this.statText = this.statNames[this.stat as Stat] || '';
    this.statTooltip = this.tooltips[this.stat as Stat] || '';
  }

}
