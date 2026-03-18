export interface CheckApplicationStatus {
    type: string,
    name: string,
    expected_status: "online" | 'stopped' | 'errored'
}
export interface HttpEndpointCheck {
    type: string,
    name: string,
    url: string,
    method: 'GET' | 'POST'
    expected_status_code: number
}
type LogPattern = "ECONNREFUSED" | "FATAL ERROR" | "OutOfMemory"

export interface Service {
    pm2ID: number,
    id: string,
    name: string,
    pm2_process_name: string,
    checks: {
        application_status: CheckApplicationStatus
        http_endpoints_check: HttpEndpointCheck[]
    }
    logs: {
        alert_on_error_patterns: LogPattern[]
    }
}