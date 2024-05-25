FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy and restore dependencies
COPY httpapi/httpapi.csproj ./httpapi/
COPY service/service.csproj ./service/
COPY repository/repository.csproj ./repository/
COPY utility/utility.csproj ./utility/
RUN dotnet restore "./httpapi/httpapi.csproj"

# Copy everything else and build
COPY httpapi/. ./httpapi/
COPY service/. ./service/
COPY repository/. ./repository/
COPY utility/. ./utility/
WORKDIR "/src/httpapi"
RUN dotnet build "httpapi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "httpapi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "httpapi.dll"]
