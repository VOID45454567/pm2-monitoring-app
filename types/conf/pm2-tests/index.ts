import type { ProjectGlobalSettings } from "./ProgectGlobalSettings"
import type { Service } from "./Service"


export interface Pm2Tests {
    project_name: string
    global_settings: ProjectGlobalSettings
    services: Service[]
}

