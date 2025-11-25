class PartyModalManager {
  public isOpen = false;
  private listener?: (isOpen: boolean) => void;

  public open() {
    this.isOpen = true;
    this.listener?.(true);
  }

  public close() {
    this.isOpen = false;
    this.listener?.(false);
  }

  public listen(cb: (isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const partyModalManager = new PartyModalManager();
