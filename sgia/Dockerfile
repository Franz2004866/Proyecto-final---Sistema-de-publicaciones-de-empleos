# ============================================================
# Dockerfile - SGIA API (.NET 10)
# ============================================================

# ----------------------------------------------------------
# Stage 1: Build
# ----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar archivos de proyecto
COPY ["SGIA.API/SGIA.API.csproj", "SGIA.API/"]
COPY ["SGIA.Application/SGIA.Application.csproj", "SGIA.Application/"]
COPY ["SGIA.Domain/SGIA.Domain.csproj", "SGIA.Domain/"]
COPY ["SGIA.Infrastructure/SGIA.Infrastructure.csproj", "SGIA.Infrastructure/"]
COPY ["SGIA.Tests/SGIA.Tests.csproj", "SGIA.Tests/"]

# Restaurar dependencias
RUN dotnet restore SGIA.API/SGIA.API.csproj

# Copiar todo el código fuente
COPY . .

# Configurar working directory y construir
WORKDIR /src/SGIA.API
RUN dotnet build SGIA.API.csproj -c Release -o /app/build

# Publicar la aplicación
RUN dotnet publish SGIA.API.csproj -c Release -o /app/publish

# ----------------------------------------------------------
# Stage 2: Runtime
# ----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copiar archivos publicados
COPY --from=build /app/publish .

# Configurar puerto HTTP
ENV ASPNETCORE_URLS=http://+:5150
ENV ASPNETCORE_ENVIRONMENT=Development

# Exponer puerto
EXPOSE 5150

# Punto de entrada
ENTRYPOINT ["dotnet", "SGIA.API.dll"]
