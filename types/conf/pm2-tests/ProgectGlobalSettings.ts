export interface ProjectGlobalSettings {
    notification: {
        email: {
            enabled: boolean,
            recipients: string[],
            smtp_server: string
            smtp_port: number
            smtp_password: string
            smtp_user: string,
            smtp_from: string,
            service_name: string
        }
        push: {
            enabled: boolean
        }
    }

}