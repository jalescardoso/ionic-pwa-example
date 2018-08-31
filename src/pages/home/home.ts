import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var window;
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	constructor(
		private _sanitizer: DomSanitizer,
		public navCtrl: NavController) {
		new Promise<any>(resolve => window.addEventListener("beforeinstallprompt", resolve))
			.then(ev => {
				console.log('beforeinstallprompt out');
				ev.preventDefault();
				this.prompt = ev;
			})
	}
	prompt;
	position;
	photoBlob;
	@ViewChild('fileInput') fileInput: ElementRef;

	takePicture() {
		let input = window.document.createElement('input');
		input.setAttribute('type', "file");
		input.setAttribute('accept', "image/*");
		input.setAttribute('capture', "camera");
		input.click();
		new Promise(resolve => input.addEventListener('change', resolve))
			.then(e => this.changeImage(e))
	}

	addHome() {
		if (!this.prompt) return;
		this.prompt.prompt();
	}

	getLoc() {
		new Promise<any>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
			.then(pos => { console.log(pos); this.position = `lat : ${pos.coords.latitude}, lng : ${pos.coords.longitude}`; })
			.catch(err => console.error(err));
	}

	changeImage(e) {
		var file = e.target.files[0];
		this.photoBlob = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
	}

}