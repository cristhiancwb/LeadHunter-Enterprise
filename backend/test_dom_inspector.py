from app.collectors.browser import GoogleMapsBrowser

URL = "https://www.google.com/maps/@-25.4738432,-49.2142592,14z?entry=ttu&g_ep=EgoyMDI2MDcyNi4wIKXMDSoASAFQAw%3D%3D"

browser = GoogleMapsBrowser(headless=False)

page = browser.abrir()

print("Abrindo URL...")

page.goto(URL)

page.wait_for_timeout(10000)

print("URL atual:")
print(page.url)

print("Título:")
print(page.title())

input("ENTER para fechar...")

browser.fechar()