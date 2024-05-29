# backend/WsApi/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy and restore dependencies
COPY WsApi/WsApi.csproj ./WsApi/
COPY service/service.csproj ./service/
COPY repository/repository.csproj ./repository/
COPY utility/utility.csproj ./utility/
RUN dotnet restore "./WsApi/WsApi.csproj"

# Copy everything else and build
COPY WsApi/. ./WsApi/
COPY service/. ./service/
COPY repository/. ./repository/
COPY utility/. ./utility/
WORKDIR "/src/WsApi"
RUN dotnet build "WsApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WsApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WsApi.dll"]
