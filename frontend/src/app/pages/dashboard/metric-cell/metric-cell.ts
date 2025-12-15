import { Component, input } from '@angular/core'
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'metric-cell',
  templateUrl: './metric-cell.html',
  imports: [FontAwesomeModule]
})
export class MetricCell {
  title = input.required<string>()
  value = input.required<string | number>()
  tooltip = input<string>()
  icon = input<IconDefinition>()


  protected infoCircle = faCircleInfo
}


