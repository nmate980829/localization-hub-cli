import { Module } from '@nestjs/common';
import { LoginCommand } from './login/login.command';
import { LoginQuestions } from './login/login.questions';
import { ConfigService } from './config/config.service';
import { LogoutCommand } from './logout/logout.command';
import { LogoutQuestions } from './logout/logout.questions';
import { PullCommand } from './pull/pull.command';
import { PushCommand } from './push/push.command';
import { InitCommand } from './init/init.command';
import { SetCommand } from './set/set.command';
import { PullQuestions } from './pull/pull.questions';
import { PushQuestions } from './push/push.questions';
import { InitQuestions } from './init/init.questions';
import { LoginService } from './login/login.service';
import { InitService } from './init/init.service';
import { SwitchCommand } from './switch/switch.command';
import { MergeCommand } from './merge/merge.command';
import { OraService } from './ora/ora.service';
import { SetService } from './set/set.service';
import { DiffCommand } from './diff/diff.command';
import { DiffService } from './diff/diff.service';
import { DiffQuestions } from './diff/diff.questions';
import { FetchCommand } from './fetch/fetch.command';
import { FetchService } from './fetch/fetch.service';
import { PushService } from './push/push.service';
import { PullService } from './pull/pull.service';

@Module({
  providers: [
    LoginCommand,
    LoginQuestions,
    ConfigService,
    LogoutCommand,
    LogoutQuestions,
    PullCommand,
    PushCommand,
    InitCommand,
    SetCommand,
    PullQuestions,
    PullService,
    PushQuestions,
    PushService,
    InitQuestions,
    LoginService,
    InitService,
    SwitchCommand,
    MergeCommand,
    OraService,
    SetService,
    DiffCommand,
    DiffService,
    DiffQuestions,
    FetchCommand,
    FetchService,
  ],
})
export class AppModule {}
