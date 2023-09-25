import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { ImGui } from '@zhobo63/imgui-ts';
import { Input, SceneManager } from 'ponczek/core';
import { withTransition } from 'examples/utils/with-transition';

export class ImGuiTestScene extends Scene {
  private counter: number = 0;

  update(): void {
    ImGui.Begin('Hello');
    ImGui.Text('Hello world from ImGui!');
    ImGui.Text(`Counter value: ${this.counter}`);

    if (ImGui.Button('Bump value')) {
      this.counter += 1;
    }

    ImGui.End();

    if (Input.getButtonDown('b')) withTransition(() => SceneManager.popScene());
  }

  render(scr: Screen): void {
    scr.clearScreen(ENDESGA16PaletteIdx[6]);

    scr.color(ENDESGA16PaletteIdx[14]);
    scr.fillRect(10, 25, 128, 256);
  }
}
