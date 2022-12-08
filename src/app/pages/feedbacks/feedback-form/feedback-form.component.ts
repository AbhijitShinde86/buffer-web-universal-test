import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import Quill from 'quill';
// import 'quill-emoji/dist/quill-emoji.js';

import { QuillConfig } from '../../../utilities/quill-config'
import { User } from 'src/app/auth/user.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'feedback-form',
  templateUrl: './feedback-form.component.html',
  styles: [
  ]
})
export class FeedbackFormComponent implements OnInit {
  @Input() submitLabel!: string;
  @Input() hasCancelButton: boolean = false;
  @Input() initialText: string = '';
  @Input() currentUser!: User;
  
  @Output()
  handleSubmit = new EventEmitter<string>();

  @Output()
  handleCancel = new EventEmitter<void>();

  form!: FormGroup; quillConfig;
  isBrowser;

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId) {
    this.quillConfig = QuillConfig.getCommentQuillConfig();
    this.isBrowser = isPlatformBrowser(platformId);

    // const icons = Quill.import('ui/icons');
    // icons['undo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>' +
    //   '<path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>';
    // icons['redo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>' +
    //   '<path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>'; 
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.initialText, Validators.required],
    });
  }

  onSubmit(): void {
    this.handleSubmit.emit(this.form.value.title);
    this.form.reset();
  }
}

