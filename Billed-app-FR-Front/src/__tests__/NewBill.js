/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"
import router from "../app/Router"
import userEvent from "@testing-library/user-event"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, I must see a form with his fields", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      expect(screen.getByTestId('expense-type')).toBeTruthy();
      expect(screen.getByTestId('expense-name')).toBeTruthy();
      expect(screen.getByTestId('datepicker')).toBeTruthy();
      expect(screen.getByTestId('amount')).toBeTruthy();
      expect(screen.getByTestId('vat')).toBeTruthy();
      expect(screen.getByTestId('pct')).toBeTruthy();
      expect(screen.getByTestId('commentary')).toBeTruthy();
      expect(screen.getByRole('button')).toBeTruthy();
    })
    test("Then, mail icon in vertical layout should be highlighted ...", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    describe("When I upload the proof file", () => {
      test("Then, an error message should appeared when the file extenstion isnt accepted", async () => {
        const html = NewBillUI()
        document.body.innerHTML = html
        const newBill = new NewBill({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        window.onNavigate(ROUTES_PATH.NewBill)

        const fileInput = screen.getByTestId('file');
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        fileInput.addEventListener('click', handleChangeFile);

        userEvent.click(fileInput);

        expect(handleChangeFile).toHaveBeenCalled();
        await waitFor(() => screen.getByText("Format de fichier invalide!"))
        const contentError = await screen.getByText("Format de fichier invalide!")
        expect(contentError).toBeTruthy()

      })
    })
  })
  describe("When I submit a valid bill", () => {
    test("Then, a new bill should be created", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })

      // Je crée ma note de frais
      const bill = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "accepted",
        "type": "Hôtel et logement",
        "commentAdmin": "ok",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "email": "a@a",
        "pct": 20
      }

      // Je remplis les champs
      screen.getByTestId('expense-type').value = bill.type
      screen.getByTestId('expense-name').value = bill.name
      screen.getByTestId('datepicker').value = bill.date
      screen.getByTestId('amount').value = bill.amount
      screen.getByTestId('vat').value = bill.vat
      screen.getByTestId('pct').value = bill.pct
      screen.getByTestId('commentary').value = bill.commentary

      newBill.fileName = bill.fileName
      newBill.fileUrl = bill.fileUrl

      // Je simule l'envoi
      const handleSubmitForm = jest.fn((e) => newBill.handleSubmit(e));
      const formNewBill = screen.getByTestId('form-new-bill')
      formNewBill.addEventListener("submit", handleSubmitForm)
      fireEvent.submit(formNewBill);

      expect(handleSubmitForm).toHaveBeenCalled();

      //test 404, 500

    })
  })
})
