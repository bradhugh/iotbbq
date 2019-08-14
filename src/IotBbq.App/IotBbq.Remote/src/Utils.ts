export class Utils {
    public static delay(milliseconds: number): Promise<void> {
        return new Promise<void>((resolve, reject) => setTimeout(resolve, milliseconds));
    }
}
