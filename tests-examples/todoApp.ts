import { expect, Locator, Page } from '@playwright/test';

class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoList: Locator;
  readonly todoCount: Locator;
  readonly toggleAll: Locator;
  readonly clearCompletedButton: Locator;

  constructor(page: Page) {
    // all the selectors are defined here
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoList = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.toggleAll = this.page.locator('#toggle-all');
  }

  // first test suite methods

  // add a todo item
  async addTodoItem(item: string) {
    await this.newTodoInput.fill(item);
    await this.newTodoInput.press('Enter');
  }

  // check if a todo item exists
  async checkTodoItemExists(item: string) {
    await expect(
      this.page.locator(`[data-testid="todo-item"]:has-text("${item}")`)
    ).toBeVisible();
  }

  // check if the todo count is correct
  async checkTodoCount(expectedCount: number) {
    const countText = await this.todoCount.textContent();
    const match = countText?.match(/(\d+)/);
    const actualCount = match ? parseInt(match[1]) : 0;
    expect(actualCount).toBe(expectedCount);
  }

  // check if the input is empty
  async checkInputIsEmpty() {
    await expect(this.newTodoInput).toBeEmpty();
  }

  // create some todos
  async createDefaultTodos(items: string[]) {
    for (const item of items) {
      await this.addTodoItem(item);
    }
  }

  // check if the todos have text
  async checkTodoCountText(text: string) {
    await expect(this.todoCount).toHaveText(text);
  }

  // check if the todos contains the number as text
  async checkTodoCountContains(text: string) {
    await expect(this.todoCount).toContainText(text);
  }

  // check if the todos have the correct titles
  async checkTodoTitles(titles: string[]) {
    await expect(this.page.getByTestId('todo-title')).toHaveText(titles);
  }

  // second test suite methods

  // mark all todos as completed
  async markAllAsCompleted() {
    await this.toggleAll.check();
  }

  // unmark all todos as completed
  async clearCompletedState() {
    const toggleAll = this.toggleAll;
    await toggleAll.check();
    await toggleAll.uncheck();
  }

  // check if todos have the correct class
  async checkAllTodosHaveClass(className: string) {
    await expect(this.page.getByTestId('todo-item')).toHaveClass([
      className,
      className,
      className,
    ]);
  }

  async uncheckFirstTodo() {
    const firstTodo = this.page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').uncheck();
  }

  async checkFirstTodo() {
    const firstTodo = this.page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').check();
  }

  // expect all todos not to be checked
  async assertToggleAllIsNotChecked() {
    const toggleAll = this.toggleAll;
    await expect(toggleAll).not.toBeChecked();
  }

  // expect all todos to be checked
  async assertToggleAllIsChecked() {
    const toggleAll = this.toggleAll;
    await expect(toggleAll).toBeChecked();
  }
}

export { TodoPage };
