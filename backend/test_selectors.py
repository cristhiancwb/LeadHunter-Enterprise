from app.collectors.selectors import (
    GoogleMapsSelectors
)


print("=" * 60)
print("TESTE DOS SELETORES")
print("=" * 60)

print()

print("SEARCH_INPUT:")

for seletor in GoogleMapsSelectors.SEARCH_INPUT:
    print("-", seletor)

print()

print("RESULT_LINKS:")

for seletor in GoogleMapsSelectors.RESULT_LINKS:
    print("-", seletor)

print()

print("BUSINESS_NAME:")

for seletor in GoogleMapsSelectors.BUSINESS_NAME:
    print("-", seletor)

print()

print("PHONE:")

for seletor in GoogleMapsSelectors.PHONE:
    print("-", seletor)

print()

print("Teste concluído.")