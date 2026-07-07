# Levanta el backend local cargando las variables de docker/.env (DB_NAME, DB_USER,
# DB_PASSWORD, DB_PORT) como variables de entorno, para no tener que setearlas a mano
# cada vez ni duplicar la password en otro archivo.
$envFile = Join-Path $PSScriptRoot "..\docker\.env"

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#=][^=]*)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim())
    }
}

& "$PSScriptRoot\mvnw.cmd" spring-boot:run
