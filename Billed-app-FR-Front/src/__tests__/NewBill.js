/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"
import router from "../app/Router"
import userEvent from "@testing-library/user-event"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
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
        const newBill = new NewBill({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })

        const html = NewBillUI()
        document.body.innerHTML = html
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
})
