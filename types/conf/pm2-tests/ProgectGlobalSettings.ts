export interface ProjectGlobalSettings {
    notification: {
        email: {
            enabled: boolean,
            recipients: string[],
            smtp_server: string
            smtp_port: number
        }
        push: {
            enabled: boolean
        }
    }

}