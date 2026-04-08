# ============================================================
# Dockerfile - TuEmpleo API (.NET 10)
# Plataforma de Publicación de Empleos
# ============================================================

# ----------------------------------------------------------
# Stage 1: Build
# ----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["TuEmpleo.API/TuEmpleo.API.csproj", "TuEmpleo.API/"]
COPY ["TuEmpleo.Application/TuEmpleo.Application.csproj", "TuEmpleo.Application/"]
COPY ["TuEmpleo.Domain/TuEmpleo.Domain.csproj", "TuEmpleo.Domain/"]
COPY ["TuEmpleo.Infrastructure/TuEmpleo.Infrastructure.csproj", "TuEmpleo.Infrastructure/"]

RUN dotnet restore TuEmpleo.API/TuEmpleo.API.csproj

COPY . .

WORKDIR /src/TuEmpleo.API
RUN dotnet build TuEmpleo.API.csproj -c Release -o /app/build

RUN dotnet publish TuEmpleo.API.csproj -c Release -o /app/publish

# ----------------------------------------------------------
# Stage 2: Runtime
# ----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5150
ENV ASPNETCORE_ENVIRONMENT=Development

EXPOSE 5150

ENTRYPOINT ["dotnet", "TuEmpleo.API.dll"]
