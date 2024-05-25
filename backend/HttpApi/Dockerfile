# backend/HttpApi/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy and restore dependencies
COPY HttpApi/HttpApi.csproj ./HttpApi/
COPY service/service.csproj ./service/
COPY repository/repository.csproj ./repository/
COPY utility/utility.csproj ./utility/
RUN dotnet restore "./HttpApi/HttpApi.csproj"

# Copy everything else and build
COPY HttpApi/. ./HttpApi/
COPY service/. ./service/
COPY repository/. ./repository/
COPY utility/. ./utility/
WORKDIR "/src/HttpApi"
RUN dotnet build "HttpApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HttpApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HttpApi.dll"]
